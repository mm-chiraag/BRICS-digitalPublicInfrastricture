import React, { useState, useEffect } from 'react';
import { RegionalLanguage, Complaint } from '../types';
import { OFFICIAL_REGIONAL_LANGUAGES } from '../data/initialComplaints';
import { speakRegionalText, stopRegionalText } from '../utils/speech';
import { PhoneCall, PhoneOff, Mic, Volume2, Sparkles, CheckCircle, Radio, MapPin, User, Send, Building2, Activity, Play, Pause } from 'lucide-react';

interface IVRCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: RegionalLanguage;
  onComplaintCreated: (complaint: Complaint) => void;
}

const PRESET_SAMPLE_CALLS: { [key in RegionalLanguage]?: { name: string; phone: string; location: string; transcript: string } } = {
  hi: {
    name: 'दीपक कुमार',
    phone: '+91 98112 23344',
    location: 'यमुना एक्सप्रेसवे, सेक्टर 62, नोएडा',
    transcript: 'नमस्ते, 1930 हेल्पलाइन। नोएडा में वेस्टर्न यमुना नहर का गेट नंबर 14 खराब हो गया है। नहर का पानी खेतों और मुख्य सड़क पर तेजी से भर रहा है, तुरंत जल बोर्ड और लोक निर्माण विभाग को भेजें।'
  },
  en: {
    name: 'Anand Sharma',
    phone: '+91 99887 76655',
    location: 'Connaught Place Barakhamba Road, New Delhi',
    transcript: 'Hello 1930 Helpline. The 33kV primary electrical power transformer near Metro Gate 3 has caught fire and exploded. Electricity is cut off across hospitals and commercial hubs.'
  },
  ru: {
    name: 'Игорь Волков',
    phone: '+7 916 999 8877',
    location: 'Ленинский проспект, Москва',
    transcript: 'Здравствуйте, прорвало магистраль центрального отопления на Ленинском проспекте! В домах нет тепла при sub-zero температуре.'
  }
};

export const IVRCallModal: React.FC<IVRCallModalProps> = ({
  isOpen,
  onClose,
  selectedLanguage,
  onComplaintCreated,
}) => {
  const [callState, setCallState] = useState<'IDLE' | 'CALLING' | 'CONNECTED' | 'PROCESSING' | 'SUCCESS'>('IDLE');
  const [currentLang, setCurrentLang] = useState<RegionalLanguage>(selectedLanguage);
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [botOutput, setBotOutput] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);

  useEffect(() => {
    setCurrentLang(selectedLanguage);
  }, [selectedLanguage]);

  // Call timer simulation
  useEffect(() => {
    let interval: any = null;
    if (callState === 'CONNECTED') {
      interval = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [callState]);

  if (!isOpen) return null;

  const handleStartCall = () => {
    setCallState('CALLING');
    setTimeout(() => {
      setCallState('CONNECTED');
      const preset = PRESET_SAMPLE_CALLS[currentLang] || PRESET_SAMPLE_CALLS['hi'] || PRESET_SAMPLE_CALLS['en']!;
      if (!citizenName) setCitizenName(preset.name);
      if (!citizenPhone) setCitizenPhone(preset.phone);
      if (!locationInput) setLocationInput(preset.location);
      if (!transcript) setTranscript(preset.transcript);
    }, 1200);
  };

  const handleLoadPreset = (lang: RegionalLanguage) => {
    const preset = PRESET_SAMPLE_CALLS[lang] || PRESET_SAMPLE_CALLS['hi'] || PRESET_SAMPLE_CALLS['en']!;
    setCurrentLang(lang);
    setCitizenName(preset.name);
    setCitizenPhone(preset.phone);
    setLocationInput(preset.location);
    setTranscript(preset.transcript);
  };

  // Web Speech API mic speech-to-text
  const handleToggleSpeech = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Mic speech recognition is not supported in this browser tab. You can type or click the regional language presets!');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      const matchedLang = OFFICIAL_REGIONAL_LANGUAGES.find((l) => l.code === currentLang);
      recognition.lang = matchedLang?.speechCode || 'hi-IN';

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript((prev) => (prev ? prev + ' ' + text : text));
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  // HD Regional Audio TTS playback
  const handlePlayTTS = (textToSpeak: string) => {
    if (isPlayingTTS) {
      stopRegionalText();
      setIsPlayingTTS(false);
      return;
    }

    speakRegionalText(
      textToSpeak,
      currentLang,
      () => setIsPlayingTTS(true),
      () => setIsPlayingTTS(false)
    );
  };

  const handleProcessIVRCall = async () => {
    if (!transcript) {
      alert('Please enter or speak the citizen complaint description.');
      return;
    }

    setCallState('PROCESSING');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/voice-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          language: currentLang,
          citizenName: citizenName || 'Citizen Caller',
          citizenPhone: citizenPhone || '+91 98765 43210',
          locationInput: locationInput || 'District Central Junction'
        })
      });

      const data = await response.json();
      setBotOutput(data);
      setCallState('SUCCESS');

      // Play voice bot audio response automatically
      if (data.botResponse) {
        handlePlayTTS(data.botResponse);
      }

      // Construct complaint object
      const newComplaint: Complaint = {
        id: 'ndpi-' + Date.now().toString(36),
        ticketNumber: `NDPI-1930-${Math.floor(1000 + Math.random() * 9000)}`,
        citizenName: citizenName || 'Public Caller',
        citizenPhone: citizenPhone || '+91 98765 43210',
        language: currentLang,
        category: data.category || 'Roads & Bridges',
        assignedDepartment: data.assignedDepartment || 'NHAI (Highways & Expressways)',
        title: data.title || 'Public Defect Reported via 1930 Hotline',
        description: data.description || transcript,
        location: {
          address: locationInput || `${data.city}, ${data.stateDistrict || 'State'}`,
          city: data.city || 'Bengaluru',
          stateDistrict: data.stateDistrict || 'District Central',
          country: data.country || 'India',
          lat: data.lat || 12.9716,
          lng: data.lng || 77.5946
        },
        createdAt: new Date().toISOString(),
        severity: data.severity || 'Major',
        complaintCount: 1,
        status: 'Pending',
        costEstimate: {
          amountUSD: data.costEstimateUSD || 45000,
          amountLocalCurrency: data.costEstimateLocal || '₹37,50,000 INR',
          breakdown: {
            materials: Math.round((data.costEstimateUSD || 45000) * 0.5),
            labor: Math.round((data.costEstimateUSD || 45000) * 0.3),
            equipment: Math.round((data.costEstimateUSD || 45000) * 0.15),
            contingency: Math.round((data.costEstimateUSD || 45000) * 0.05)
          },
          completionTimeDays: 7,
          justification: 'Automated civil engineering cost calculation via server-side Gemini AI for national public works.'
        },
        voiceTranscript: transcript
      };

      // Save to backend database
      await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComplaint)
      });

      onComplaintCreated(newComplaint);
    } catch (e) {
      console.error(e);
      alert('Failed to process incoming IVR call.');
      setCallState('CONNECTED');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl text-slate-100 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 via-slate-900 to-indigo-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30">
              <PhoneCall className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display">Toll-Free 1930 Live Call Receiver Simulator</h2>
              <p className="text-xs text-slate-300">National Government IVR Voice AI & Regional Language Classifier</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs transition-colors"
          >
            ✕ Close
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {callState === 'IDLE' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center text-red-400 shadow-xl shadow-red-950/50">
                <Radio className="w-10 h-10 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-display">Simulate Incoming Toll-Free Call (1930)</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  Citizens call 1930 in any of the 22 official regional languages. The AI Voice Bot transcribes, translates, categorizes, estimates repair costs, and dispatches to the correct ministry department.
                </p>
              </div>

              {/* Language Chips */}
              <div className="flex justify-center gap-1.5 flex-wrap max-w-xl mx-auto py-2 max-h-36 overflow-y-auto p-2 bg-slate-950/60 rounded-2xl border border-slate-800">
                {OFFICIAL_REGIONAL_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLoadPreset(lang.code)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      currentLang === lang.code
                        ? 'bg-red-600 text-white shadow-lg ring-2 ring-red-400'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleStartCall}
                className="w-full max-w-sm py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-red-950/60 flex items-center justify-center gap-2 mx-auto transition-all transform active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Trigger Incoming 1930 Call</span>
              </button>
            </div>
          )}

          {callState === 'CALLING' && (
            <div className="text-center py-12 space-y-4">
              <div className="w-24 h-24 mx-auto rounded-full bg-red-500/20 border-2 border-red-400 flex items-center justify-center text-red-400 animate-pulse">
                <PhoneCall className="w-12 h-12" />
              </div>
              <h3 className="text-lg font-bold text-red-400 font-display">Incoming Call on Line 1930...</h3>
              <p className="text-xs text-slate-400">Connecting to National Regional Language AI Gateway</p>
            </div>
          )}

          {(callState === 'CONNECTED' || callState === 'PROCESSING') && (
            <div className="space-y-4">
              {/* Active Call Bar with Animated Waveform */}
              <div className="bg-red-950/40 border border-red-800/50 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
                  <span className="text-xs font-bold text-red-300 uppercase tracking-wider">
                    CALL LIVE ON LINE 1930 • {formatTimer(callTimer)}
                  </span>
                </div>

                {/* Animated Spectrum Waveform */}
                <div className="flex items-center gap-1">
                  <span className="w-1 h-4 bg-red-500 animate-pulse"></span>
                  <span className="w-1 h-6 bg-red-400 animate-bounce"></span>
                  <span className="w-1 h-3 bg-red-500 animate-pulse"></span>
                  <span className="w-1 h-7 bg-amber-400 animate-bounce"></span>
                  <span className="w-1 h-4 bg-red-400 animate-pulse"></span>
                  <span className="w-1 h-2 bg-indigo-400 animate-ping"></span>
                </div>

                <div className="text-xs text-slate-300 font-mono bg-black/40 px-2.5 py-1 rounded-lg border border-slate-800">
                  Lang: {OFFICIAL_REGIONAL_LANGUAGES.find(l => l.code === currentLang)?.name} ({currentLang.toUpperCase()})
                </div>
              </div>

              {/* Citizen Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Citizen Caller Name</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      placeholder="e.g. Anand Varma"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Caller Mobile Number</label>
                  <input
                    type="text"
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    placeholder="+91 98450 11223"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Location / Landmark Stated in Call</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="e.g. Outer Ring Road, Marathahalli Junction, Bengaluru"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Speech / Transcript Area */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-red-400" />
                    <span>Voice Complaint Audio Transcript ({OFFICIAL_REGIONAL_LANGUAGES.find(l => l.code === currentLang)?.name})</span>
                  </label>
                  <button
                    onClick={handleToggleSpeech}
                    className={`flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-lg border transition-colors ${
                      isRecording
                        ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Mic className="w-3 h-3" />
                    <span>{isRecording ? 'Listening...' : 'Speak via Mic'}</span>
                  </button>
                </div>

                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  rows={3}
                  placeholder="Describe defect, bridge damage, water main burst, or power blackout in official regional language..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Quick Regional Presets Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                <span className="text-[10px] text-slate-400 whitespace-nowrap">Load Voice Sample:</span>
                {OFFICIAL_REGIONAL_LANGUAGES.slice(0, 10).map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleLoadPreset(l.code)}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-[10px] text-slate-300 whitespace-nowrap"
                  >
                    {l.flag} {l.name}
                  </button>
                ))}
              </div>

              {/* Submit / End Call */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => setCallState('IDLE')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>Disconnect</span>
                </button>

                <button
                  onClick={handleProcessIVRCall}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-red-950/50 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Gemini AI Processing 1930 Call...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Analyze Call & Dispatch to Department</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {callState === 'SUCCESS' && botOutput && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white font-display">1930 Call Analyzed & Dispatched to Ministry</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ticket created, prioritized, and updated on the National GIS Command Map.
                </p>
              </div>

              {/* Analyzed Card */}
              <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-4 text-left space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <Building2 className="w-4 h-4" />
                    <span>Assigned Dept: {botOutput.assignedDepartment}</span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-600 text-white">
                    {botOutput.severity}
                  </span>
                </div>

                <div className="text-xs text-slate-200">
                  <span className="font-bold text-white text-sm">{botOutput.title}</span>
                  <p className="text-[11px] text-slate-300 mt-1">{botOutput.description}</p>
                </div>

                {/* Regional Voice Response Box with TTS Playback */}
                <div className="p-3 bg-indigo-950/40 border border-indigo-800/50 rounded-xl text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] text-indigo-300 font-bold flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Voice Bot Regional Response ({currentLang.toUpperCase()}):</span>
                    </div>

                    <button
                      onClick={() => handlePlayTTS(botOutput.botResponse)}
                      className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                    >
                      {isPlayingTTS ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      <span>{isPlayingTTS ? 'Stop Speech' : '🔊 Hear Native Audio'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-200 italic font-mono bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    "{botOutput.botResponse}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-slate-300">
                  <div>
                    <span className="text-slate-500">Location:</span> {botOutput.city}, {botOutput.stateDistrict || botOutput.country}
                  </div>
                  <div>
                    <span className="text-slate-500">AI Est Budget:</span> <span className="font-bold text-emerald-400">{botOutput.costEstimateLocal}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-xl transition-colors"
              >
                View in National Command Priority Queue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
