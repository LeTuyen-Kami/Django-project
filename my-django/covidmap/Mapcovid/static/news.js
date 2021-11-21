let scroll1 = document.querySelector(":root");
window.addEventListener("scroll", function () {
  let max = document.body.scrollHeight - window.innerHeight;
  let width = window.innerWidth;
  let handle = (width * window.scrollY) / max - width;
  scroll1.style.setProperty("--right", handle + "px");
  if (window.scrollY >= 300) {
    document.querySelector("#gotop").style.display = "block";
  } else {
    document.querySelector("#gotop").style.display = "none";
  }
});
const news_search = document.getElementById("news_search");
const csrf = document.getElementsByName("csrfmiddlewaretoken")[0].defaultValue;
const pagination_id = document.getElementById("pagination_id");
const current = document.getElementsByClassName("current")[0];
news_search.addEventListener("keyup", function () {
  $.ajax({
    url: "/search_result/",
    type: "POST",
    data: {
      csrfmiddlewaretoken: csrf,
      query: news_search.value,
      page: current.id,
    },
    success: function (data) {
      if (data.query != null) addSearchToContent(data.query);
    },
    error: function (error) {
      console.log(error);
    },
  });
});
function addSearchToContent(news) {
  const removeContent = document.getElementsByClassName("content");
  while (removeContent.length > 0) {
    removeContent[0].parentNode.removeChild(removeContent[0]);
  }
  const text_click = document.getElementsByClassName("text_click");
  while (text_click.length > 0) {
    text_click[0].parentNode.removeChild(text_click[0]);
  }

  const news_content = document.getElementById("news_content");
  const news_text_click = document.getElementById("text_click");
  const container_news_content = document.getElementById(
    "container_news_content"
  );
  for (let i = 0; i < news.length; i++) {
    //add news to the page
    news_content.innerHTML += `<div class="content" id="${news[i].id}" >
      <div class="center_content">
          <a href="https://covid19.gov.vn${news[i].url}" title="${news[i].title}" target="_blank"><img src="${news[i].image}" alt="" ></a> 
          <a href="https://covid19.gov.vn${news[i].url}" title="${news[i].title}" target="_blank"><p class="subject">${news[i].title}</p></a>
          <p class="content_content">${news[i].description}</p>
      </div>          
    </div>`;
    news_text_click.innerHTML += `<a href="#${news[i].id}" class="text_click">${news[i].title}</a>`;
    if (news_search.value.length > 0) {
      const removepagination = document.getElementById("pagination_id");
      if (removepagination != null) {
        removepagination.parentNode.removeChild(removepagination);
      }
    } else {
      //check have pagination in page
      if (document.getElementById("step-links") === null) {
        container_news_content.innerHTML += pagination_id.innerHTML;
      }
    }
  }
}
