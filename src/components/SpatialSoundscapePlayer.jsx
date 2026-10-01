import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Disc, Sparkles, Activity, ShieldCheck } from 'lucide-react';

/**
 * Lossless Spatial Soundscape & Acoustic Studio Player
 * Web Audio API procedural synthesizer simulating spatial lossless audio, binaural harmonics,
 * and high-fidelity frequency waveforms for acoustic products (headphones, speakers, sanctuary soundscapes).
 */
export default function SpatialSoundscapePlayer({ productName = 'Spatial Acoustic Demonstration' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [activeProfile, setActiveProfile] = useState('hi_res_spatial'); // 'hi_res_spatial' | 'vinyl_warmth' | 'zen_acoustic'
  const [frequencies, setFrequencies] = useState([20, 35, 60, 45, 80, 55, 90, 70, 40, 25, 50, 75, 65, 30]);

  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const oscillatorRefs = useRef([]);
  const animFrameRef = useRef(null);

  const PROFILES = [
    {
      id: 'hi_res_spatial',
      label: 'Beryllium 96kHz Lossless Spatial',
      desc: 'Wide holographic soundstage with binaural 432Hz harmonic overtones.',
      baseFreq: 216,
      subFreq: 432,
    },
    {
      id: 'vinyl_warmth',
      label: 'Analog Master Tape & Vinyl',
      desc: 'Warm analog saturation with tube harmonic warmth and gentle low-end presence.',
      baseFreq: 174,
      subFreq: 348,
    },
    {
      id: 'zen_acoustic',
      label: 'Kyoto Sanctuary Meditation',
      desc: 'Ambient resonant frequencies tuned to natural atmospheric silence.',
      baseFreq: 528,
      subFreq: 264,
    },
  ];

  // Start procedural Web Audio synthesis
  const startAudio = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
      gainNode.connect(ctx.destination);
      gainNodeRef.current = gainNode;

      const profile = PROFILES.find(p => p.id === activeProfile) || PROFILES[0];

      // Primary carrier oscillator
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(profile.baseFreq, ctx.currentTime);

      // Spatial binaural harmonic
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(profile.subFreq, ctx.currentTime);

      // Stereo panner for spatial depth
      if (ctx.createStereoPanner) {
        const panner1 = ctx.createStereoPanner();
        panner1.pan.setValueAtTime(-0.6, ctx.currentTime);
        osc1.connect(panner1);
        panner1.connect(gainNode);

        const panner2 = ctx.createStereoPanner();
        panner2.pan.setValueAtTime(0.6, ctx.currentTime);
        osc2.connect(panner2);
        panner2.connect(gainNode);
      } else {
        osc1.connect(gainNode);
        osc2.connect(gainNode);
      }

      osc1.start();
      osc2.start();
      oscillatorRefs.current = [osc1, osc2];
      setIsPlaying(true);

      // Animate waveform bars
      const animateWave = () => {
        setFrequencies((prev) =>
          prev.map(() => Math.floor(Math.random() * 75) + 20)
        );
        animFrameRef.current = requestAnimationFrame(animateWave);
      };
      animateWave();
    } catch (err) {
      console.warn('Web Audio API not allowed without user interaction:', err);
    }
  };

  const stopAudio = () => {
    oscillatorRefs.current.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    oscillatorRefs.current = [];
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setIsPlaying(false);
    setFrequencies([20, 30, 25, 35, 20, 30, 25, 20, 25, 30, 20, 25, 20, 15]);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  const switchProfile = (profileId) => {
    setActiveProfile(profileId);
    if (isPlaying) {
      stopAudio();
      setTimeout(startAudio, 100);
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try {
          audioCtxRef.current.close();
        } catch {}
      }
    };
  }, []);

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-r from-[#181622] via-[#0D0B12] to-[#181622] border border-[#C2A676]/30 text-white shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#C2A676]/15 border border-[#C2A676]/30 flex items-center justify-center text-[#C2A676]">
            <Disc className={`w-4 h-4 ${isPlaying ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C2A676]">
                Lossless Spatial Studio
              </span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold">
                24-BIT / 96KHZ
              </span>
            </div>
            <p className="text-xs text-white/90 font-medium truncate max-w-xs">
              {productName}
            </p>
          </div>
        </div>

        {/* Master Play/Pause Button */}
        <button
          onClick={togglePlayback}
          className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 shadow-md ${
            isPlaying
              ? 'bg-[#C2A676] text-[#0B0A0E] hover:opacity-90'
              : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause Demo</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play Spatial Audio</span>
            </>
          )}
        </button>
      </div>

      {/* Waveform Visualization Bars */}
      <div className="h-10 bg-black/40 rounded-xl px-4 py-2 border border-white/5 flex items-end justify-between gap-1">
        {frequencies.map((height, i) => (
          <div
            key={i}
            className={`w-full rounded-t transition-all duration-150 ${
              isPlaying
                ? 'bg-gradient-to-t from-[#C2A676] to-[#E8D4AC]'
                : 'bg-white/20 h-2'
            }`}
            style={{ height: `${isPlaying ? height : 15}%` }}
          />
        ))}
      </div>

      {/* Profile Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
        {PROFILES.map((p) => {
          const isActive = activeProfile === p.id;
          return (
            <button
              key={p.id}
              onClick={() => switchProfile(p.id)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-white/10 border-[#C2A676] text-white shadow-xs'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold block">{p.label}</span>
                {isActive && isPlaying && <Activity className="w-3 h-3 text-[#C2A676] animate-pulse" />}
              </div>
              <p className="text-[10px] text-white/50 font-light mt-0.5 leading-snug line-clamp-2">
                {p.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
