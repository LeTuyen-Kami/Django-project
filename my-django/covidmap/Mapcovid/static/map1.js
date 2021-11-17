//map
var mapcovid_json;
$.ajax({
  type: "GET",
  url: "/mapcovid-json/",
  success: function (response) {
    mapcovid_json = response;
  },
  error: function (error) {
    console.log(error);
  },
});

var sliding = document.getElementById("sliding");
var item = document.querySelectorAll("a");
function indicator(e) {
  sliding.style.left = e.offsetLeft + "px";
}
item.forEach((link) => {
  link.addEventListener("mouseover", (e) => {
    indicator(e.target);
  });
});
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
function filterHoverTinh(map, name) {
  map.setFilter("states-layer-hover", ["==", "NAME_1", name]);
  map.setFilter("states-layer-hover1", ["==", "NAME_1", name]);
}
class createMap {
  constructor(tt, style, khuvuc) {
    this.tt = tt;
    this.style = style;
    this.khuvuc = khuvuc;
  }
  access_Token =
    "pk.eyJ1Ijoia2FuZWtpcml0bzEyNzciLCJhIjoiY2t1MGphMm4wMHV4eDJvczhzMmp3Z2dwNyJ9.lXjaIHaVdGyfuKN_aXZI_g";
  defaultMap() {
    mapboxgl.accessToken = this.access_Token;

    // Create a new map.
    const map = new mapboxgl.Map({
      container: "map",
      style: this.style,
      bounds: [
        [102.144796000004, 8.3141966009692],
        [109.5694718, 23.3922699957244],
      ],
    });
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.FullscreenControl());
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
    return {
      map,
      popup,
    };
  }

  addSourceLayer(map) {
    if (map.getLayer("states-layer")) map.removeLayer("states-layer");
    if (map.getLayer("states-layer-hover1"))
      map.removeLayer("states-layer-hover1");
    if (map.getLayer("states-layer-hover"))
      map.removeLayer("states-layer-hover");
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
  set khuVuc(value) {
    this.khuvuc = value;
  }
  get khuVuc() {
    return this.khuvuc;
  }
  getTinh(map, name) {
    map.getSource("states").setData(huyen);
    map.setFilter("states-layer", ["==", "NAME_1", name]);
    let ten_Tinh = name + " Vietnam";
    if (name == "Hải Phòng") ten_Tinh = "Haiphong Vietnam";
    if (name == "Hà Nội") ten_Tinh = "Hanoi Vietnam";
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${ten_Tinh}.json?access_token=${this.access_Token}`
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
      })
      .catch((err) => console.log(err));
    this.khuVuc = "huyen";
  }
  getHuyen(map, name_tinh, name_huyen) {
    let fix_name_huyen = name_huyen;
    if (fix_name_huyen.split(" ").length > 2) {
      fix_name_huyen = fix_name_huyen.replace(
        /Huyện |Quận |Thị xã |Thành phố /,
        ""
      );
    }
    map.getSource("states").setData(xa);
    map.setFilter("states-layer", [
      "all",
      ["==", "NAME_1", name_tinh],
      ["==", "NAME_2", fix_name_huyen],
    ]);
    let ten_Tinh = name_tinh + " Vietnam";
    if (name_tinh == "Hải Phòng") ten_Tinh = "Haiphong Vietnam";
    if (name_tinh == "Hà Nội") ten_Tinh = "Hanoi Vietnam";
    let tenHuyen = name_huyen + " " + ten_Tinh;
    if (document.querySelector("h3") != null)
      tenHuyen = document.querySelector("h3").textContent + " " + ten_Tinh;
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${tenHuyen}.json?access_token=${this.access_Token}`
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
      })
      .catch((err) => console.log(err));
    let ten_Huyen = "";
    if (document.querySelector("h3") != null)
      ten_Huyen = document.querySelector("h3").textContent;
    this.khuVuc = "xa";
    //console.log(ten_Huyen);
    //return ten_Huyen;
  }
  getXa(map, e, ten_Huyen) {
    let ten_Tinh = e.features[0].properties.NAME_1 + " Vietnam";
    if (e.features[0].properties.NAME_1 == "Hải Phòng")
      ten_Tinh = "Haiphong Vietnam";
    if (e.features[0].properties.NAME_1 == "Hà Nội") ten_Tinh = "Hanoi Vietnam";
    let ten_Xa = "";
    if (document.querySelector("h3") != null)
      ten_Xa = document.querySelector("h3").textContent;
    let tenXaDayDu = ten_Xa + " " + ten_Huyen + " " + ten_Tinh;
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${tenXaDayDu}.json?access_token=${this.access_Token}`
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
      })
      .catch((err) => console.log(err));
  }
  loadmap() {
    const defaultmap = this.defaultMap();
    const map = defaultmap.map;
    const popup = defaultmap.popup;
    map.on(this.tt, () => {
      this.addSourceLayer(map);
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
        if (this.khuVuc == "tinh") {
          if (currentPositon != lastPositon) {
            document.querySelector("#popup h3").innerHTML =
              e.features[0].properties.NAME_1;
            fetch(
              `https://provinces.open-api.vn/api/p/search/?q=${e.features[0].properties.NAME_1}`
            )
              .then((response) => response.json())
              .then((text) => {
                document.querySelector("#popup h3").innerHTML = text[0].name;
              })
              .catch((err) => console.log(err));
            let tenTinh = e.features[0].properties.NAME_1;
            mapcovid_json.map((data) => {
              let name = data.name;
              if (name.includes(tenTinh)) {
                document.querySelector("#cases").innerHTML = data.cases;
                document.querySelector("#casesToday").innerHTML =
                  data.casesToday;
                document.querySelector("#casesDeath").innerHTML = data.death;
                return;
              }
            });
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
        if (this.khuVuc == "huyen") {
          if (currentPositon1 != lastPositon) {
            document.querySelector("#popup h3").innerHTML =
              e.features[0].properties.NAME_2;
            fetch(
              `https://provinces.open-api.vn/api/d/search/?q=${e.features[0].properties.NAME_2}`
            )
              .then((response) => response.json())
              .then((text) => {
                document.querySelector("#popup h3").innerHTML = text[0].name;
              })
              .catch((err) => console.log(err));
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
        if (this.khuVuc == "xa") {
          if (currentPositon2 != lastPositon) {
            document.querySelector("#popup h3").innerHTML =
              e.features[0].properties.NAME_3;
            fetch(
              `https://provinces.open-api.vn/api/w/search/?q=${e.features[0].properties.NAME_3}`
            )
              .then((response) => response.json())
              .then((text) => {
                document.querySelector("#popup h3").innerHTML = text[0].name;
              })
              .catch((err) => console.log(err));
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
        if (this.khuVuc == "tinh") {
          this.getTinh(map, e.features[0].properties.NAME_1);
        } else if (this.khuVuc == "huyen") {
          ten_Huyen = this.getHuyen(
            map,
            e.features[0].properties.NAME_1,
            e.features[0].properties.NAME_2
          );
        } else if (this.khuVuc == "xa") {
          this.getXa(map, e, ten_Huyen);
        }
      });
      map.on("mouseenter", "states-layer", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "states-layer", () => {
        map.getCanvas().style.cursor = "";
        if (popup != null) popup.remove();
        if (this.khuVuc == "tinh") {
          map.setFilter("states-layer-hover", ["==", "NAME_1", ""]);
          map.setFilter("states-layer-hover1", ["==", "NAME_1", ""]);
        }
        if (this.khuVuc == "huyen") {
          map.setFilter("states-layer-hover", ["==", "NAME_2", ""]);
          map.setFilter("states-layer-hover1", ["==", "NAME_2", ""]);
        }
        if (this.khuVuc == "xa") {
          map.setFilter("states-layer-hover", ["==", "NAME_3", ""]);
          map.setFilter("states-layer-hover1", ["==", "NAME_3", ""]);
        }
      });
    });
    return map;
  }
}
var Mapcreate = new createMap(
  "load",
  "mapbox://styles/mapbox/streets-v11",
  "tinh"
);
var map = Mapcreate.loadmap();
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
      var style_map = "mapbox://styles/mapbox/" + layerId;
      Mapcreate = new createMap("style.load", style_map, "tinh");
      map = Mapcreate.loadmap();
    }
  })
);
//serach
class DataList {
  constructor(containerId, inputId, listId, options, area, tenKhuVuc) {
    this.containerId = containerId;
    this.inputId = inputId;
    this.listId = listId;
    this.options = options;
    this.area = area;
    this.tenKhuVuc = tenKhuVuc;
  }
  set Options(value) {
    this.options = value.options;
    this.area = value.area;
    this.tenKhuVuc = value.tenKhuVuc;
  }
  get Options() {
    return this.tenKhuVuc;
  }
  create(filter = "", value) {
    const list = document.getElementById(this.listId);
    const filterOptions = value.filter(
      (d) =>
        filter === "" || d.name.toLowerCase().includes(filter.toLowerCase())
    );

    if (filterOptions.length === 0) {
      list.classList.remove("active");
    } else {
      list.classList.add("active");
    }

    list.innerHTML = filterOptions
      .map((o) => `<li id=${o.code}>${o.name}</li>`)
      .join("");
  }
  setDefault(value) {
    if (this.area == 2) {
      const input1 = document.getElementById("datalist-input1");
      const input2 = document.getElementById("datalist-input2");
      input1.value = "";
      input2.value = "";
      input1.placeholder = "Chọn Huyện";
      input2.placeholder = "Chọn Xã";
    } else if (this.area == 3) {
      const input = document.getElementById(this.inputId);
      input.placeholder = value;
      input.value = "";
    }
  }
  addListeners() {
    const container = document.getElementById(this.containerId);
    const input = document.getElementById(this.inputId);
    const list = document.getElementById(this.listId);
    const area = this.area;
    const _this = this;
    container.addEventListener("click", (e) => {
      if (e.target.id === this.inputId) {
        container.classList.toggle("active");
      } else if (e.target.id === "datalist-icon") {
        container.classList.toggle("active");
        input.focus();
      }
    });
    list.addEventListener("click", function (e) {
      if (e.target.nodeName.toLocaleLowerCase() === "li") {
        input.value = e.target.innerText;
        if (area == 1) {
          if (e.target.id != 99999) {
            Mapcreate.getTinh(
              map,
              e.target.innerText.replace(/Tỉnh |Thành phố /, "")
            );
            displayHuyen(e.target.id, e.target.innerText);
            search_huyen.style.display = "block";
            search_xa.style.display = "none";
          } else {
            map.fitBounds([
              [102.144796000004, 8.3141966009692],
              [109.5694718, 23.3922699957244],
            ]);
            map.setFilter("states-layer");
            map.getSource("states").setData(tinh);
            Mapcreate.khuVuc = "tinh";
            search_huyen.style.display = "none";
            search_xa.style.display = "none";
          }
        } else if (area == 2) {
          Mapcreate.getHuyen(
            map,
            _this.Options.replace(/Tỉnh |Thành phố /, ""),
            e.target.innerText
          );
          displayXa(e.target.id, e.target.innerText);
          search_xa.style.display = "block";
        }
        container.classList.remove("active");
      }
    });
  }
  addEventListenerInput(datalist) {
    const container = document.getElementById(this.containerId);
    const input = document.getElementById(this.inputId);
    const options = this.options;
    input.addEventListener("input", function (e) {
      if (!container.classList.contains("active")) {
        container.classList.add("active");
      }

      datalist.create(input.value, options);
    });
  }
}
function getdata(gdata, placeHolder, area, tenKhuVuc) {
  if (area == 1) {
    datalistTinh.Options = { options: gdata, area: area, tenKhuVuc: tenKhuVuc };
    datalistTinh.create("", gdata);
    datalistTinh.setDefault(placeHolder);
    datalistTinh.addEventListenerInput(datalistTinh);
  }
  if (area == 2) {
    datalistHuyen.Options = {
      options: gdata,
      area: area,
      tenKhuVuc: tenKhuVuc,
    };
    datalistHuyen.create("", gdata);
    datalistHuyen.setDefault(placeHolder);
    datalistHuyen.addEventListenerInput(datalistHuyen);
  }
  if (area == 3) {
    datalistXa.Options = { options: gdata, area: area, tenKhuVuc: tenKhuVuc };
    datalistXa.create("", gdata);
    datalistXa.setDefault(placeHolder);
    datalistXa.addEventListenerInput(datalistXa);
  }
}
function displayHuyen(id, tenTinh) {
  fetch(`https://provinces.open-api.vn/api/p/${id}?depth=2`)
    .then((res) => res.json())
    .then((content) => {
      getdata(content.districts, "Chọn huyện", 2, tenTinh);
    });
}
function displayXa(id, tenHuyen) {
  fetch(`https://provinces.open-api.vn/api/d/${id}?depth=2`)
    .then((res) => res.json())
    .then((content) => {
      getdata(content.wards, "Chọn xã", 3, tenHuyen);
    });
}

fetch("https://provinces.open-api.vn/api/p/")
  .then((res) => res.json())
  .then((content) => {
    content.unshift({ name: "Toàn quốc", code: 99999 });
    getdata(content, "Chọn tỉnh", 1, "");
  });
var datalistTinh = new DataList(
  "datalist",
  "datalist-input",
  "datalist-ul",
  [],
  1,
  ""
);
var datalistHuyen = new DataList(
  "datalist1",
  "datalist-input1",
  "datalist-ul1",
  [],
  2,
  ""
);
var datalistXa = new DataList(
  "datalist2",
  "datalist-input2",
  "datalist-ul2",
  [],
  3,
  ""
);

datalistTinh.addListeners();
datalistHuyen.addListeners();
datalistXa.addListeners();
var search_xa = document.getElementById("datalist2");
var search_huyen = document.getElementById("datalist1");
search_huyen.style.display = "none";
search_xa.style.display = "none";
