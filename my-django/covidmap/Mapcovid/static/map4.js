var mapcovid_json;
$.ajax({
  type: "GET",
  url: "/mapcovid-json/",
  success: function (response) {
    mapcovid_json = response;
    response.map((data) => {
      console.log(data.name);
    });
  },
  error: function (error) {
    console.log(error);
  },
});

var sliding = document.getElementById("sliding");
var item = document.querySelectorAll("a");
const access_Token =
  "pk.eyJ1Ijoia2FuZWtpcml0bzEyNzciLCJhIjoiY2t1MGphMm4wMHV4eDJvczhzMmp3Z2dwNyJ9.lXjaIHaVdGyfuKN_aXZI_g";
function indicator(e) {
  sliding.style.left = e.offsetLeft + "px";
}
item.forEach((link) => {
  link.addEventListener("mouseover", (e) => {
    indicator(e.target);
  });
});
mapboxgl.accessToken = access_Token;
// Create a new map.
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  bounds: [
    [102.144796000004, 8.3141966009692],
    [109.5694718, 23.3922699957244],
  ],
});
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());
map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
  }),
  "top-left"
);
var tinh;
var huyen;
var xa;
fetch("/static/vietnam_tinh.geojson")
  .then((response) => response.json())
  .then((text) => (tinh = text));
fetch("/static/vietnam_huyen.geojson")
  .then((response) => response.json())
  .then((text1) => (huyen = text1));
fetch("/static/vietnam.geojson")
  .then((response) => response.json())
  .then((text1) => (xa = text1));
var popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
}).setHTML(
  `<div id="popup">
                <h3></h3>
                <p class="left">Tổng ca dương tính:</p>
                <p class="right" id="cases">${16}</p>
                <p class="left">Ca dương tính trong ngày:</p>
                <p class="right" id="casesToday">${16}</p>
                <p class="left">Tỷ lệ vùng xanh:</p>
                <p class="right">${16}</p>
                <p class="left">Tử vong:</p>
                <p class="right" id="casesDeath">${16}</p>
                </div>
                `
);
function addSourceLayer() {
  if (map.getLayer("states-layer")) map.removeLayer("states-layer");
  if (map.getLayer("states-layer-hover1"))
    map.removeLayer("states-layer-hover1");
  if (map.getLayer("states-layer-hover")) map.removeLayer("states-layer-hover");
  if (map.getSource("states")) map.removeSource("states");
  map.addSource("states", {
    type: "geojson",
    data: tinh,
  });

  //Add a layer showing the state polygons.
  map.addLayer({
    id: "states-layer",
    type: "fill",
    source: "states",
    paint: {
      "fill-color": "rgba(200, 100, 240, 0.4)",
      "fill-outline-color": "red",
    },
  });
  map.addLayer({
    id: "states-layer-hover1",
    type: "fill",
    source: "states",
    paint: {
      "fill-color": "rgba(200, 100, 240, 0.6)",
    },
    filter: ["==", "NAME_1", ""],
  });
  map.addLayer({
    id: "states-layer-hover",
    type: "line",
    source: "states",
    paint: {
      "line-color": "white",
      "line-width": 2,
    },
    filter: ["==", "NAME_1", ""],
  });
}
// function processData(data, tenTinh) {
//   let name = data.name;
//   if (name.includes(tenTinh)) {
//     document.querySelector("#cases").innerHTML = data.cases;
//     document.querySelector("#casesToday").innerHTML = data.casesToday;
//     document.querySelector("#casesDeath").innerHTML = data.death;
//     return;
//   }
// }
var x;
function loadmap(trangthai) {
  map.on(trangthai, () => {
    let click = 0;
    addSourceLayer();
    let currentPositon;
    let lastPositon = "";
    let currentPositon1;
    let currentPositon2;
    map.on("mousemove", "states-layer", (e) => {
      popup.setLngLat(e.lngLat);
      if (popup != null) popup.addTo(map);
      currentPositon = e.features[0].properties.NAME_1;
      currentPositon1 = e.features[0].properties.NAME_2;
      currentPositon2 = e.features[0].properties.NAME_3;
      if (click == 0) {
        if (currentPositon != lastPositon) {
          document.querySelector("#popup h3").innerHTML = e.features[0].properties.NAME_1;
          fetch(
            `https://provinces.open-api.vn/api/p/search/?q=${e.features[0].properties.NAME_1}`
          )
            .then((response) => response.json())
            .then((text) => {
              if (text[0].name != null) {
                document.querySelector("#popup h3").innerHTML = text[0].name;
              }
            });
          let tenTinh = e.features[0].properties.NAME_1;
          // fetch("https://static.pipezero.com/covid/data.json")
          //   .then((response) => response.json())
          //   .then((text) => {
          //       if(text!=null){
          //     for (let i = 0; i < 63; i++) {
          //       let name = text.locations[i].name;
          //       if (name.includes(tenTinh)) {
          //         document.querySelector("#cases").innerHTML =
          //           text.locations[i].cases;
          //         document.querySelector("#casesToday").innerHTML =
          //           text.locations[i].casesToday;
          //         document.querySelector("#casesDeath").innerHTML =
          //           text.locations[i].death;
          //         break;
          //       }
          //     }
          // }
          //   });
          mapcovid_json.map(
            (data) =>{
              let name = data.name;
              if (name.includes(tenTinh)) {
                document.querySelector("#cases").innerHTML = data.cases;
                document.querySelector("#casesToday").innerHTML =
                  data.casesToday;
                document.querySelector("#casesDeath").innerHTML = data.death;
                return;
            }           
            }
          );
        }
        lastPositon = currentPositon;
        map.setFilter("states-layer-hover", [
          "==",
          "NAME_1",
          e.features[0].properties.NAME_1,
        ]);
        map.setFilter("states-layer-hover1", [
          "==",
          "NAME_1",
          e.features[0].properties.NAME_1,
        ]);
      }
      if (click == 1) {
        if (currentPositon1 != lastPositon) {
          document.querySelector("#popup h3").innerHTML = e.features[0].properties.NAME_2;
          fetch(
            `https://provinces.open-api.vn/api/d/search/?q=${e.features[0].properties.NAME_2}`
          )
            .then((response) => response.json())
            .then((text) => {
              document.querySelector("#popup h3").innerHTML = text[0].name;
            });
        }
        lastPositon = currentPositon1;
        if (e.features[0].properties.NAME_2 != undefined) {
          map.setFilter("states-layer-hover", [
            "all",
            ["==", "NAME_1", e.features[0].properties.NAME_1],
            ["==", "NAME_2", e.features[0].properties.NAME_2],
          ]);
          map.setFilter("states-layer-hover1", [
            "all",
            ["==", "NAME_1", e.features[0].properties.NAME_1],
            ["==", "NAME_2", e.features[0].properties.NAME_2],
          ]);
        }
      }
      if (click == 2) {
        if (currentPositon2 != lastPositon) {
          document.querySelector("#popup h3").innerHTML = e.features[0].properties.NAME_3;
          fetch(
            `https://provinces.open-api.vn/api/w/search/?q=${e.features[0].properties.NAME_3}`
          )
            .then((response) => response.json())
            .then((text) => {
              document.querySelector("#popup h3").innerHTML = text[0].name;
            });
        }
        lastPositon = currentPositon2;
        if (e.features[0].properties.NAME_3 != undefined) {
          map.setFilter("states-layer-hover", [
            "all",
            ["==", "NAME_2", e.features[0].properties.NAME_2],
            ["==", "NAME_3", e.features[0].properties.NAME_3],
          ]);
          map.setFilter("states-layer-hover1", [
            "all",
            ["==", "NAME_2", e.features[0].properties.NAME_2],
            ["==", "NAME_3", e.features[0].properties.NAME_3],
          ]);
        }
      }
      
    });
    var ten_Huyen;
    map.on("click", "states-layer", (e) => {
      if (click == 0) {
        map.getSource("states").setData(huyen);
        map.setFilter("states-layer", [
          "==",
          "NAME_1",
          e.features[0].properties.NAME_1,
        ]);
        let ten_Tinh = e.features[0].properties.NAME_1 + " Vietnam";
        if (e.features[0].properties.NAME_1 == "Hải Phòng")
          ten_Tinh = "Haiphong Vietnam";
        if (e.features[0].properties.NAME_1 == "Hà Nội")
          ten_Tinh = "Hanoi Vietnam";
        fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${ten_Tinh}.json?access_token=${access_Token}`
        )
          .then((response) => response.json())
          .then((data) => {
            let bbox;
            let i = 0;
            bbox = data.features[i].bbox;
            while (data.features[i].place_type[0] != "region") {
              i++;
              bbox = data.features[i].bbox;
            }
            map.fitBounds([
              [bbox[0], bbox[1]],
              [bbox[2], bbox[3]],
            ]);
          });
      }
      if (click == 1) {
        map.getSource("states").setData(xa);
        map.setFilter("states-layer", [
          "all",
          ["==", "NAME_1", e.features[0].properties.NAME_1],
          ["==", "NAME_2", e.features[0].properties.NAME_2],
        ]);
        let ten_Tinh = e.features[0].properties.NAME_1 + " Vietnam";
        if (e.features[0].properties.NAME_1 == "Hải Phòng")
          ten_Tinh = "Haiphong Vietnam";
        if (e.features[0].properties.NAME_1 == "Hà Nội")
          ten_Tinh = "Hanoi Vietnam";
        let tenHuyen =
          document.querySelector("h3").textContent + " " + ten_Tinh;
        console.log(tenHuyen);
        fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${tenHuyen}.json?access_token=${access_Token}`
        )
          .then((response) => response.json())
          .then((data) => {
            let bbox;
            let i = 0;
            while (bbox == undefined) {
              bbox = data.features[i].bbox;
              i++;
            }
            map.fitBounds([
              [bbox[0], bbox[1]],
              [bbox[2], bbox[3]],
            ]);
          });
        ten_Huyen = document.querySelector("h3").textContent;
      }
      if (click == 2) {
        let ten_Tinh = e.features[0].properties.NAME_1 + " Vietnam";
        if (e.features[0].properties.NAME_1 == "Hải Phòng")
          ten_Tinh = "Haiphong Vietnam";
        if (e.features[0].properties.NAME_1 == "Hà Nội")
          ten_Tinh = "Hanoi Vietnam";
        let ten_Xa = document.querySelector("h3").textContent;
        let tenXaDayDu = ten_Xa + " " + ten_Huyen + " " + ten_Tinh;
        console.log(tenXaDayDu);
        fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${tenXaDayDu}.json?access_token=${access_Token}`
        )
          .then((response) => response.json())
          .then((data) => {
            let bbox;
            let i = 0;
            while (bbox == undefined) {
              bbox = data.features[i].bbox;
              i++;
            }
            map.fitBounds([
              [bbox[0], bbox[1]],
              [bbox[2], bbox[3]],
            ]);
          });
        // map.flyTo({
        //   center: e.lngLat,
        //   zoom: 11.9,
        // });
      }
      if (click < 2) click = click + 1;
    });
    map.on("mouseenter", "states-layer", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "states-layer", () => {
      map.getCanvas().style.cursor = "";
      if (popup != null) popup.remove();
      if (click == 0) {
        map.setFilter("states-layer-hover", ["==", "NAME_1", ""]);
        map.setFilter("states-layer-hover1", ["==", "NAME_1", ""]);
      }
      if (click == 1) {
        map.setFilter("states-layer-hover", ["==", "NAME_2", ""]);
        map.setFilter("states-layer-hover1", ["==", "NAME_2", ""]);
      }
      if (click == 2) {
        map.setFilter("states-layer-hover", ["==", "NAME_3", ""]);
        map.setFilter("states-layer-hover1", ["==", "NAME_3", ""]);
      }
    });
  });
}
loadmap("load");
const layers = document.querySelectorAll(".img");
var lastClick;
var currentClick;
var lastClick_p;
var currentClick_p;
layers.forEach((el) =>
  el.addEventListener("click", (event) => {
    if (event.target.tagName != "P" && event.target != currentClick) {
      var p = document.querySelector(`#${event.target.id} + p`);

      if (lastClick_p != undefined) {
        lastClick_p.style.color = "black";
        lastClick_p.style.fontWeight = "none";
      }
      currentClick_p = p;
      p.style.color = "blue";
      if (lastClick != undefined) lastClick.style.border = "none";
      currentClick = event.target;
      currentClick.style.border = "3px solid blue";
      lastClick = currentClick;
      lastClick_p = currentClick_p;
      const layerId = event.target.id;
      map.setStyle("mapbox://styles/mapbox/" + layerId);
      loadmap("style.load");
    }
  })
);
