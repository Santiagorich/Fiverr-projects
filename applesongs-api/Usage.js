var path = "top-new-songs.php";
fetch(`https://67.205.176.127:7000/api?path=${path}`)
  .then((response) => response.json())
  .then((data) => {
    var songs = "";
    for (let song of data) {
      songs += `<div style="display:flex; flex-direction:column;width:fit-content;height:fit-content;align-items: center;width: 100%;margin-top:2em">
      <h3 style="font-weight:800;text-align: center;margin:0 0 0 0 !important;">${song.number}. ${song.title} - ${song.artist}</h3>
        <div style="margin-bottom:1em;margin-top:1em;">
        <p style="margin:0 0 0 0 !important;"><span style="font-weight:600;">Released:</span> ${song.release !=""? song.release:"Unknown"}</p>
        <p style="margin:0 0 0 0 !important;"><span style="font-weight:600;">Genre:</span> ${song.genre !=""? song.genre:"Unknown"}</p>
        </div>
        <div style="display:flex; flex-direction:column; justify-content:center;width: 100%;height:fit-content;align-items:center;gap:1em;">
        <img src="${song.image}" alt="${song.title} - ${song.artist}">
        <audio controls="" controlslist="nodownload" preload="none"><source src="${song.song}"></audio>
        </div>
      </div>`;
    }
    document.querySelector("#output").innerHTML = songs;
  });
