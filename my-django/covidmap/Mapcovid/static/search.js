class DataList {
  constructor(containerId, inputId, listId, options, area) {
    this.containerId = containerId;
    this.inputId = inputId;
    this.listId = listId;
    this.options = options;
    this.area = area;
  }
  set Options(value) {
    this.options = value.options;
    this.area = value.area;
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
        if (area == 1) displayHuyen(e.target.id);
        else if (area == 2) displayXa(e.target.id);
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
fetch("https://provinces.open-api.vn/api/p/")
  .then((res) => res.json())
  .then((content) => {
    getdata(content, "Chọn tỉnh", 1);
  });
var datalistTinh = new DataList(
  "datalist",
  "datalist-input",
  "datalist-ul",
  [],
  1
);
var datalistHuyen = new DataList(
  "datalist1",
  "datalist-input1",
  "datalist-ul1",
  [],
  2
);
var datalistXa = new DataList(
  "datalist2",
  "datalist-input2",
  "datalist-ul2",
  [],
  3
);

datalistTinh.addListeners();
datalistHuyen.addListeners();
datalistXa.addListeners();
function getdata(gdata, placeHolder, area) {
  if (area == 1) {
    datalistTinh.Options = { options: gdata, area: area };
    datalistTinh.create("", gdata);
    datalistTinh.setDefault(placeHolder);
    datalistTinh.addEventListenerInput(datalistTinh);
  }
  if (area == 2) {
    datalistHuyen.Options = { options: gdata, area: area };
    datalistHuyen.create("", gdata);
    datalistHuyen.setDefault(placeHolder);
    datalistHuyen.addEventListenerInput(datalistHuyen);
  }
  if (area == 3) {
    datalistXa.Options = { options: gdata, area: area };
    datalistXa.create("", gdata);
    datalistXa.setDefault(placeHolder);
    datalistXa.addEventListenerInput(datalistXa);
  }
}
function displayHuyen(id) {
  fetch(`https://provinces.open-api.vn/api/p/${id}?depth=2`)
    .then((res) => res.json())
    .then((content) => {
      getdata(content.districts, "Chọn huyện", 2);
    });
}
function displayXa(id) {
  fetch(`https://provinces.open-api.vn/api/d/${id}?depth=2`)
    .then((res) => res.json())
    .then((content) => {
      getdata(content.wards, "Chọn xã", 3);
    });
}
