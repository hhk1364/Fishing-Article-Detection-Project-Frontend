var list = document.getElementsByTagName("a");

var href_list = [];
var sebu1 = [];
var sebu2 = [];

for (i = 0; i < list.length; i++) {
    var href = list[i].getAttribute("href");
    if(href != null){
        if(href.includes("https://n.news.naver.com")){
            
        }
    }
}

// CSRF 토큰을 쿠키에서 읽어오는 함수
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
}



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
    // API 응답 데이터를 처리합니다.
    console.log(data);
    // url 꺼내와서 
    for (i = 0; i < list.length; i++) {
        
        var href = list[i].getAttribute("href");

        if(href != null){
            if(href.includes("https://n.news.naver.com")){

                var span = document.createElement("span");
                span.classList = ["tooltiptext"];
                span.innerHTML = "제목과 컨텐츠 불일치 :  "+"<br>"+ "본문의 일관성 부족 :  " ;
            
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

