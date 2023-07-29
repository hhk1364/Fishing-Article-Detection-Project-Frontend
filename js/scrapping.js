SERVER_HOST = "https://happycorder.store:8080"
// const SERVER_HOST = "http://127.0.0.1:8000";
// const valid_url = ["https://n.news.naver.com"];
const valid_url = ["n"];

// 초반 실행
const href_list = Array.from(refresh()[0]);  
const elementList = refresh()[1];  
toApiServer(href_list, elementList);

// 이벤트 실행
const refreshButtons = document.getElementsByClassName("_refresh_btn");
const _paging = document.getElementsByClassName("_paging");

if(refreshButtons.length > 0){
  for(var i=0; i<refreshButtons.length; i++){
    refreshButtons[i].addEventListener("click", handleRefreshClick);
  }
}
if(_paging.length > 0){
  for(var i=0; i<_paging.length; i++){
    _paging[i].addEventListener("click", handleRefreshClick);
  }
}


// MutationObserver 생성
// var section_list_ranking_press_tmp = document.getElementsByClassName("section_list_ranking_press");
// var targetElementListText;
// for(var i=0; i<section_list_ranking_press_tmp.length; i++){
//   if(section_list_ranking_press_tmp[i].style.display == 'block'){
//       targetElementListText = section_list_ranking_press_tmp[i];
//   }
// }
const targetElementpaging = document.getElementById("paging");

const observer = new MutationObserver((mutations) => {
  
  var isTrue = false;
  
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node) => {
        if (node.classList && (node.classList.contains("_paging"))) {
            isTrue = true;
        }
      });
    }
  });

  if(isTrue){
    handleRefreshClick();
  }
  
});

// 옵션 설정 (자식 노드 추가에 대해서만 감지)
const config = { childList: true };

// MutationObserver 시작
if(targetElementpaging != null){
  observer.observe(targetElementpaging, config);
}
//observer.observe(targetElementListText, config);

//////////////
//함수정의////
//////////////

function handleRefreshClick(event) {
  var href_list = Array.from(refresh()[0]);  
  var elementList = refresh()[1];  
  toApiServer(href_list, elementList);
}

function refresh(){

  var href_set =  [];
  var elementList = [];

  var list = document.getElementsByTagName("a");
  
  for (var i = 0; i < list.length; i++) {
    var href = list[i].getAttribute("href");
    if(href != null){
      for(var j=0; j<valid_url.length; j++){
        if(href.includes(valid_url[j])){
          if ((list[i].display != "none" && !hasParentDisplayNone(list[i])) || list[i].className.includes("sh_text_headline")) {
            if(!list[i].parentElement.classList.contains("sh_thumb_inner") 
                  && !list[i].parentElement.classList.contains("cluster_thumb_inner") 
                  && !list[i].parentElement.classList.contains("photo")
                  && !list[i].className.includes("ranking_thumb")){
                if(!href_set.includes(href)){
                    href_set.push(href);
                    elementList.push(list[i]);
                }
            }  
          }
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
      // 현재 시간을 가져오는 Date 객체 생성
      const now = new Date();

      // 시간 정보를 콘솔에 출력
      console.log("시작", now);
      

      fetch(SERVER_HOST + '/api/getResultUsingByHref/', {
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
          // 현재 시간을 가져오는 Date 객체 생성
          const now = new Date();

          // 시간 정보를 콘솔에 출력
          console.log("끝",now);

          console.log(data);  // 받은 응답 데이터 처리
          // url 꺼내와서 
          for (i = 0; i < elementList.length; i++) {
              
              var href = elementList[i].attributes.href.value;

              if(href != null){
                    if(href == data.link[i]){
                        var span = document.createElement("span");
                        span.classList = ["tooltiptext"];

                        var sebu1;
                        var sebu2;
                        var gwango;

                        if(data.sebu1_result[i] == "결과 없음" || data.sebu1_result[i] == "내용없음"){
                          sebu1 = data.sebu1_result[i];
                        }else{
                          sebu1 = Math.round(parseFloat(data.sebu1_result[i]) * 100).toString()  + "%";
                        }
                        if(data.sebu2_result[i] == "내용없음" || data.sebu2_result[i] == "결과 없음"){
                          sebu2 = data.sebu2_result[i];
                        }else{
                          sebu2 = Math.round(parseFloat(data.sebu2_result[i]) * 100).toString()  + "%";
                        }
                        if(data.gwango_result[i] == "내용없음" || data.gwango_result[i] == "결과 없음"){
                          gwango = data.gwango_result[i];
                        }else{
                          gwango = Math.round(parseFloat(data.gwango_result[i]) * 100).toString()  + "%";
                        }
                        span.innerHTML =  "광고성 :  "
                                          + gwango
                                          +"<br>"
                                          +"낚시성 :  "
                                          + sebu1
                                          +"<br>"
                                          + "본문 일관성 부족 :  " 
                                          + sebu2;
                    
                        var targetRect = elementList[i].getBoundingClientRect();
                        elementList[i].prepend(span);
                        
                        elementList[i].setAttribute("onmouseover", ""
                            
                            +"var tooltipEl = this.querySelector('.tooltiptext'); "
                            +"tooltipEl.style.opacity = '1'; "
                            +"tooltipEl.style.visibility = 'visible';"
                            +"tooltipEl.style.letterSpacing = 0 + 'px';"
                            +"tooltipEl.style.lineHeight  = 15 + 'px';"
                            +"tooltipEl.style.height  = 'fit-content';"

                            +"var mouseX = event.clientX;"
                            +"var mouseY = event.clientY;"
                        
                            +"tooltipEl.style.position = 'fixed';"
                            +"tooltipEl.style.left = mouseX - tooltipEl.offsetWidth/4 + 5 + 'px';"
                            +"tooltipEl.style.top = mouseY - tooltipEl.offsetHeight - 10 + 'px';"
                            
                        );
                        //elementList[i].style.cursor= "url('http://127.0.0.1:8000/api/mouseImage/'), auto";
                        elementList[i].setAttribute("onmouseout", "var tooltipEl = this.querySelector('.tooltiptext'); tooltipEl.style.opacity = '0'; tooltipEl.style.visibility = 'hidden';")
                        elementList[i].setAttribute("onclick", "var tooltipEl = this.querySelector('.tooltiptext'); tooltipEl.style.opacity = '0'; tooltipEl.style.visibility = 'hidden';")

                      }   
              }

          }
        })
        .catch((error) => {
          console.error(error);
        });
}

var currentlink = document.location.href; 

if(currentlink != null){
  for(var j=0; j<valid_url.length; j++){
    if(currentlink.includes(valid_url[j])){
        fetch(SERVER_HOST + '/api/detailNews/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // mode : 'no-cors', // Do not send CSRF token to another domain.
        body: JSON.stringify({ 
          "href" : currentlink
        })
      })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('불러오기 API 요청이 실패했습니다.');
            }
        })
        .then((data) => {
            console.log(data);
            
            var value = data.suspicious_sentences[0];
        
            if(value.length > 0){

              var splittedText = value.split(" [SEP] ")[1];
              var list = splittedText.split("다.");
              var da = document.getElementById("dic_area").innerHTML.split("다.");
              var result = [];

            
              for(var i=0; i<da.length; i++){
                if(i < da.length-1){
                  if(list.length <= 0){
                    result.push((da[i]+"다."));
                }else{
                  var html = (da[i]+"다.").replace("[^ㄱ-ㅎㅏ-ㅣ가-힣0-9a-zA-Z\s\[\]]().?!$%&", "");
                  html = html.replace("\s+", " ");
                  
                  var isdo = true;
                  
                  for(var j=0; j<list.length; j++){
                    if(list.length > 0){
                      if(html.includes(list[j])){
                        
                        var idx = 0;
                        var isSame = false;

                        for(var z=0; z<html.length; z++){
                            if(idx >= 2){
                              if(isSame){
                                result.push("<mark class='fishingMark' style='background: lightgoldenrodyellow;'>"+da[i]+"다."+"</mark>");
                                list = list.slice(0, j).concat(list.slice(j+1));
                                isdo = false;
                                break;
                              }
                            }
                            if(html.charAt(z) == list[j].charAt(idx)){
                              idx++;
                              isSame = true;
                            }else{
                              isSame = false;
                            }
                        }
                      }
                    }else{
                      break;
                    }
                  }

                  if(isdo){
                    result.push((da[i]+"다."));
                  }
                }
                }
                
              }
              
              document.getElementById("dic_area").innerHTML = result.join("").toString();
                        
              el = document.getElementsByClassName("fishingMark");
              
              for(var f=0; f<el.length; f++){
                var span = document.createElement("span");
                span.classList = ["tooltiptext"];
                span.innerHTML = "본문 일관성이 부족하다고 의심되는 부분입니다";
                var targetRect = el[f].getBoundingClientRect();
                el[f].prepend(span);
                
                el[f].setAttribute("onmouseover", ""
                    
                    +"var tooltipEl = this.querySelector('.tooltiptext'); "
                    +"tooltipEl.style.opacity = '1'; "
                    +"tooltipEl.style.visibility = 'visible';"
                    +"tooltipEl.style.letterSpacing = 0 + 'px';"
                    +"tooltipEl.style.lineHeight  = 5 + 'px';"
                    +"tooltipEl.style.fontSize  = 5 + 'px';"
                    +"tooltipEl.style.height  = 'fit-content';"

                    +"var mouseX = event.clientX;"
                    +"var mouseY = event.clientY;"
                
                    +"tooltipEl.style.position = 'fixed';"
                    +"tooltipEl.style.left = mouseX - tooltipEl.offsetWidth/4 + 5 + 'px';"
                    +"tooltipEl.style.top = mouseY - tooltipEl.offsetHeight - 10 + 'px';"
                    
                );
                el[f].setAttribute("onmouseout", "var tooltipEl = this.querySelector('.tooltiptext'); tooltipEl.style.opacity = '0'; tooltipEl.style.visibility = 'hidden';")
              }
                              
            }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
}