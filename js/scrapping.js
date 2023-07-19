const href_list = Array.from(refresh()[0]);  
const elementList = refresh()[1];  
toApiServer(href_list, elementList);

function handleRefreshClick(event) {
  var href_list = Array.from(refresh()[0]);  
  var elementList = refresh()[1];  
  toApiServer(href_list, elementList);
}

const refreshButtons = document.getElementsByName("_refresh_btn");
const _paging = document.getElementsByName("_paging");
const refresh_button = document.getElementsByName("refresh_button");

refreshButtons.forEach((button) => {
  button.addEventListener("click", handleRefreshClick);
});
_paging.forEach((button) => {
  button.addEventListener("click", handleRefreshClick);
});
refresh_button.forEach((button) => {
  button.addEventListener("click", handleRefreshClick);
});

function refresh(){

  var href_set = new Set();
  var elementList = [];

  var list = document.getElementsByTagName("a");
  
  for (i = 0; i < list.length; i++) {
    var href = list[i].getAttribute("href");
    if(href != null){
        if(href.includes("https://n.news.naver.com")){
            if ((list[i].display != "none" && !hasParentDisplayNone(list[i])) || list[i].className.includes("sh_text_headline")) {
                href_set.add(href);
                elementList.push(list[i]);
            }
        }
    }
  }

  return [href_set, elementList];

}

function hasParentDisplayNone(element) {
  var parent = element.parentElement;
  while (parent) {
    if (window.getComputedStyle(parent).display == "none") {
      return true;
    }
    parent = parent.parentElement;
  }
  return false;
}



// CSRF 토큰을 쿠키에서 읽어오는 함수
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
}


function toApiServer(href_list, elementList){
      //href_list = ['https://n.news.naver.com/mnews/article/047/0002398464']
      // 'https://happycorder.store:8080/api/getTitleContentUsingByHref/'
      fetch('http://127.0.0.1:8000/api/getTitleContentUsingByHref/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')  // CSRF 토큰을 요청 헤더에 포함합니다.
        },
        body: JSON.stringify({ 
          "href" : href_list
        })
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('API 요청이 실패했습니다.');
          }
        })
        .then((data) => {
          console.log(data);  // 받은 응답 데이터 처리
          // url 꺼내와서 
          for (i = 0; i < elementList.length; i++) {
              
              var href = elementList[i].getAttribute("href");

              if(href != null){
                  if(href.includes("https://n.news.naver.com")){

                      var span = document.createElement("span");
                      span.classList = ["tooltiptext"];
                      span.innerHTML = "제목과 컨텐츠 일치성 :  "
                                        + data.sebu1_result[i]
                                        +"<br>"
                                        + "본문의 일관성 :  " 
                                        + data.sebu2_result[i];
                  
                      var targetRect = list[i].getBoundingClientRect();
                      list[i].prepend(span);
                      
                      list[i].setAttribute("onmouseover", ""
                          
                          +"var tooltipEl = this.querySelector('.tooltiptext'); "
                          +"tooltipEl.style.opacity = '1'; "
                          +"tooltipEl.style.visibility = 'visible';"
                          +"tooltipEl.style.letterSpacing = 0 + 'px';"
                          +"tooltipEl.style.lineHeight  = 15 + 'px';"

                          +"var mouseX = event.clientX;"
                          +"var mouseY = event.clientY;"
                      
                          +"tooltipEl.style.position = 'fixed';"
                          +"tooltipEl.style.left = mouseX - tooltipEl.offsetWidth/4 + 5 + 'px';"
                          +"tooltipEl.style.top = mouseY - tooltipEl.offsetHeight - 10 + 'px';"
                          
                      );
                      
                      list[i].setAttribute("onmouseout", "var tooltipEl = this.querySelector('.tooltiptext'); tooltipEl.style.opacity = '0'; tooltipEl.style.visibility = 'hidden';")
                  }
              }

          }
        })
        .catch((error) => {
          console.error(error);
        });
}

