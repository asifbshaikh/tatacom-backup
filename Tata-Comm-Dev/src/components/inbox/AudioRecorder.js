import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'reactstrap';
import RecordRTC from 'recordrtc';

function App({ onRecorderBlob, showAudioRecorderEditor, setBlob }) {
  const stream = useRef(null);
  const recorderRef = useRef(null);
  const [timerCount, setTimerCount] = useState(0);
  const Ref = useRef(null);
  const RefTimer = useRef(null);

  const getRandomString = () => {
    if (
      window.crypto &&
      window.crypto.getRandomValues &&
      navigator.userAgent.indexOf('Safari') === -1
    ) {
      const a = window.crypto.getRandomValues(new Uint32Array(3));
      let token = '';
      for (let i = 0, l = a.length; i < l; i += 1) {
        token += a[i].toString(36);
      }
      return token.toLowerCase();
    }
    return (Math.random() * new Date().getTime())
      .toString(36)
      .replace(/\./g, '');
  };
  const getAudioFileName = () => {
    const d = new Date();
    return `audio-${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${getRandomString()}.wav`;
  };
  const handleRecording = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });

    stream.current = mediaStream;
    recorderRef.current = new RecordRTC(mediaStream, {
      type: 'audio',
      mimeType: 'audio/wav',
      disableLogs: true,
      recorderType: RecordRTC.StereoAudioRecorder,
      sampleRate: 44100,
      numberOfAudioChannels: 2,
      checkForInactiveTracks: true,
      bufferSize: 4096,
    });
    recorderRef.current.startRecording();

    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      setTimerCount(timerCount + 1);
      let timerCountNew = 1;
      if (RefTimer.current.innerHTML) {
        timerCountNew = parseInt(RefTimer.current.innerHTML, 10) + 1;
      }
      RefTimer.current.innerHTML = timerCountNew;
    }, 1000);
    Ref.current = id;
  };

  const handleStop = () => {
    recorderRef.current.stopRecording(() => {
      stream?.current?.getTracks().forEach((track) => track.stop());
      const finalBlob = recorderRef.current.getBlob();
      setBlob(finalBlob);
      const audioFileFinal = new File([finalBlob], getAudioFileName(), {
        type: 'audio/wav',
      });
      onRecorderBlob(audioFileFinal);
      if (Ref.current) clearInterval(Ref.current);
      Ref.current = null;
    });
  };

  const cleanAudioRecorder = () => {
    if (stream?.current?.getTracks) {
      stream?.current?.getTracks().forEach((track) => track.stop());
    }
    if (recorderRef?.current?.destroy) {
      recorderRef.current.destroy();
    }
    if (Ref?.current) {
      clearInterval(Ref.current);
      Ref.current = null;
    }
  };

  useEffect(() => {
    return () => {
      cleanAudioRecorder();
      setBlob(null);
    };
  }, []);

  useEffect(() => {
    if (!showAudioRecorderEditor) {
      cleanAudioRecorder();
    }
  }, [showAudioRecorderEditor]);

  return (
    <div className="aud-recorder">
      {!timerCount && (
        <Button
          onClick={handleRecording}
          outline
          color="primary"
          className="icon-button large1 btn-sm ml-1"
        >
          <i className="simple-icon-control-play" />
        </Button>
      )}
      {timerCount > 0 && Ref.current && (
        <Button
          onClick={handleStop}
          outline
          color="primary"
          className="icon-button large1 btn-sm ml-1"
        >
          <i className="simple-icon-control-pause" />
          <span ref={RefTimer} />
        </Button>
      )}
    </div>
  );
}

export default React.memo(App);
