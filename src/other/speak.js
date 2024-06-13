function promisifiedTimeout(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function playAudios(urls) {
  if (!urls || !urls.length) {
    return;
  }

  const _checkEnd = async (audio) => {
    if (audio.ended) {
      return true;
    }
    await promisifiedTimeout(200);
    return _checkEnd(audio);
  };

  const _play = (url) => {
    return new Promise((resolve, reject) => {
      if (!url) {
        return resolve();
      }

      let audio = new Audio(url);
      audio.oncanplay = () => {
        audio.play();
      };

      _checkEnd(audio).then(resolve);
    });
  };

  for (let url of urls) {
    if (url) {
      await _play(url);
    }
  }
}

function playSynthesis({ text, lang, name, voice } = {}) {
  if (window.speechSynthesis.speaking || !text) {
    return;
  }

  let msg = new SpeechSynthesisUtterance();
  msg.text = text;
  if (lang) {
    msg.lang = lang;
  }

  let voices = speechSynthesis.getVoices();
  let v;

  if (lang === "en-US") {
    v =
      voices.find((x) => x.name === voice) ||
      voices.find((x) => x.name === "Google US English") ||
      voices.find((x) => x.lang === "en-US" && x.name === "Samantha");
    if (v) {
      msg.voice = v;
    }
  } else if (name) {
    v = voices.find((x) => x.name.toLowerCase().includes(name.toLowerCase()));
    if (v) {
      msg.voice = v;
    }
  }

  window.speechSynthesis.speak(msg);
}

if (!navigator.userAgent.includes("Gecko/")) {
  // not Firefox, Firefox doesn't support offscreen.
  chrome.runtime.onMessage.addListener(
    ({ type, ameSrc, breSrc, otherSrc, synthesisObj }) => {
      if (type === "speak") {
        playAudios([ameSrc, breSrc, otherSrc]);
        playSynthesis(synthesisObj);
      }
    }
  );
}

export { playAudios, playSynthesis };
