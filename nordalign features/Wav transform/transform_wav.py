from pydub import AudioSegment
AudioSegment.converter = "ffmpeg/bin/ffmpeg"

def match_target_amplitude(sound, target_dBFS):
    change_in_dBFS = target_dBFS - sound.dBFS
    return sound.apply_gain(change_in_dBFS)

def optimizeAudio(file):
    if file.endswith(".wav"):
        sound = AudioSegment.from_wav(file)
        sound = sound.set_channels(1)
        sound = sound.set_frame_rate(32000)
        sound = match_target_amplitude(sound, -24.0) # -24.0 is the target dBFS = 70dB SPL
        sound.export(file, format="wav")

optimizeAudio('test.wav')