import { container } from '../services/container.js';
import { LLMProviderFactory } from '../llm/provider-factory.js';
import { logger } from '../logger/logger.js';

export class TranscriptionOrchestrator {
  constructor() {
    this.isSTTRecording = false;
    this.isAssistantRecording = false;
  }

  get audioRecorder() { return container.get('audioRecorder'); }
  get soundPlayer() { return container.get('soundPlayer'); }
  get whisperRunner() { return container.get('whisperRunner'); }
  get typingEngine() { return container.get('typingEngine'); }
  get configManager() { return container.get('configManager'); }

  async toggleSpeechToText(onStatusChange = null) {
    if (!this.isSTTRecording) {
      try {
        // Start recording STT
        this.isSTTRecording = true;
        this.soundPlayer.playStart();
        if (onStatusChange) onStatusChange('Listening for Speech-to-Text...');
        await this.audioRecorder.startRecording();
        logger.info('Started STT audio recording session');
      } catch (err) {
        this.isSTTRecording = false;
        this.soundPlayer.playError();
        if (onStatusChange) onStatusChange(`STT Error: ${err.message}`);
      }
    } else {
      // Stop recording STT & process
      this.isSTTRecording = false;
      this.soundPlayer.playStop();
      if (onStatusChange) onStatusChange('Processing Whisper transcription...');

      try {
        const audioPath = await this.audioRecorder.stopRecording();
        const transcription = await this.whisperRunner.transcribe(audioPath);
        logger.info({ transcription }, 'Whisper STT completed successfully');

        if (transcription) {
          if (onStatusChange) onStatusChange(`Typing: "${transcription}"`);
          await this.typingEngine.typeText(transcription);
          this.soundPlayer.playSuccess();
        } else {
          if (onStatusChange) onStatusChange('No speech detected.');
        }
      } catch (err) {
        logger.error({ err }, 'Error during STT orchestration');
        this.soundPlayer.playError();
        if (onStatusChange) onStatusChange(`STT Error: ${err.message}`);
      }
    }
  }

  async toggleAIAssistant(onStatusChange = null, onStreamToken = null) {
    if (!this.isAssistantRecording) {
      try {
        // Start recording AI Assistant prompt
        this.isAssistantRecording = true;
        this.soundPlayer.playStart();
        if (onStatusChange) onStatusChange('Listening for AI Assistant prompt...');
        await this.audioRecorder.startRecording();
        logger.info('Started AI Assistant audio recording session');
      } catch (err) {
        this.isAssistantRecording = false;
        this.soundPlayer.playError();
        if (onStatusChange) onStatusChange(`AI Assistant Error: ${err.message}`);
      }
    } else {
      // Stop recording & process through Whisper + LLM
      this.isAssistantRecording = false;
      this.soundPlayer.playStop();
      if (onStatusChange) onStatusChange('Transcribing speech...');

      try {
        const audioPath = await this.audioRecorder.stopRecording();
        const userPrompt = await this.whisperRunner.transcribe(audioPath);
        logger.info({ userPrompt }, 'Whisper prompt transcription completed');

        if (!userPrompt) {
          if (onStatusChange) onStatusChange('No speech detected for AI Assistant.');
          return;
        }

        const profile = this.configManager.getCurrentLLMProfile();
        if (!profile) {
          throw new Error('No LLM profile selected. Configure via /setup llm config');
        }

        if (onStatusChange) onStatusChange(`Sending prompt to ${profile.name}...`);

        const provider = LLMProviderFactory.createProvider(profile);
        const messages = [
          { role: 'system', content: 'You are a helpful AI assistant. Provide concise, direct answers suitable for quick typing or documentation.' },
          { role: 'user', content: userPrompt }
        ];

        let fullResponse = '';
        const streamingEnabled = this.configManager.get('streaming');
        fullResponse = await provider.streamChat(messages, onStreamToken, streamingEnabled);

        if (onStatusChange) onStatusChange(`Typing response (${fullResponse.length} chars)...`);
        await this.typingEngine.typeText(fullResponse);
        this.soundPlayer.playSuccess();

        return { userPrompt, fullResponse };
      } catch (err) {
        logger.error({ err }, 'Error during AI Assistant orchestration');
        this.soundPlayer.playError();
        if (onStatusChange) onStatusChange(`AI Assistant Error: ${err.message}`);
      }
    }
  }
}

export const transcriptionOrchestrator = new TranscriptionOrchestrator();
