SERVER_HOST = "https://happycorder.store:8080"
// const SERVER_HOST = "http://127.0.0.1:8000";
const valid_url = ["https://n.news.naver.com"];

var currentlink = ""; 


chrome.windows.getCurrent(function(win) {
    chrome.tabs.query( {'windowId': win.id, 'active': true},
    function(tabs) {
        if(tabs.length != 'undefined' && tabs.length == 1){
            currentlink = tabs[0].url;
            for(var j=0; j<valid_url.length; j++){
                if(currentlink.includes(valid_url[j])){
                    document.getElementById("body").style.display = "block";
                    fetch(SERVER_HOST + '/api/detailNews/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
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
                            
                            var gwango;
                            var sebu1;
                            var sebu2;

                            if(data.gwango_result[0] == "내용없음" || data.gwango_result[0] == "결과 없음"){
                                gwango = data.gwango_result[0];
                            }else{
                                gwango = Math.round(parseFloat(data.gwango_result[0]) * 100).toString() + "%";
                            }

                            if(data.sebu1_result[0] == "내용없음" || data.sebu1_result[0] == "결과 없음"){
                                sebu1 = data.sebu1_result[0];
                            }else{
                                sebu1 = Math.round(parseFloat(data.sebu1_result[0]) * 100).toString()  + "%";
                            }

                            if(data.sebu2_result[0] == "내용없음" || data.sebu1_result[0] == "결과 없음"){
                                sebu2 = data.sebu2_result[0];
                            }else{
                                sebu2 = Math.round(parseFloat(data.sebu2_result[0]) * 100).toString()  + "%";
                            }

                            document.getElementById("gwango").innerText = "광고성 : " + gwango;
                            document.getElementById("1sebu").innerText = "낚시성 : " + sebu1;
                            document.getElementById("2sebu").innerText = "일관성 부족도 : " + sebu2;

                        })
                        .catch((error) => {
                        console.error(error);
                        });
                }else{
                    document.getElementById("body").style.display = "none";
                }
            }
        }   
    })
});

  function getRadioValues() {
    var radioButtons = document.querySelectorAll('input[type="radio"]');
    var values = {};

    radioButtons.forEach((radio) => {
      if (radio.checked) {
        values[radio.name] = radio.value;
      }
    });

    return values;
  }

document.getElementById("thumbsjechul").onclick = function thumbsjechul(){
    if(currentlink != null){
        for(var j=0; j<valid_url.length; j++){
            if(currentlink.includes(valid_url[j])){
            
            var obj = getRadioValues();
            obj["link"] = currentlink;

            gothumbsjechul(obj);

            }else{
                alert("기사 페이지에 들어가 주세요.")
            }
        }
    }else{
        alert("기사 페이지에 들어가 주세요.")
    }
}



document.getElementById("singojechul").onclick = function goSingo(){
        
    if(currentlink != null){
        for(var j=0; j<valid_url.length; j++){
            if(currentlink.includes(valid_url[j])){
                
                var obj_length = document.getElementsByName("singo").length;
                list = [];
                
                for (var i=0; i<obj_length; i++) {
                    if (document.getElementsByName("singo")[i].checked == true) {
                        list.push(document.getElementsByName("singo")[i].value);       
                    }
                }

                gosingo(currentlink, list)
            }else{
                alert("신고하려는 기사 페이지에 들어가 주세요.")
            }
        }
    }else{
        alert("신고하려는 기사 페이지에 들어가 주세요.")
    }
}

function gothumbsjechul(map){
    fetch(SERVER_HOST + '/api/thumbs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // mode : 'no-cors', // Do not send CSRF token to another domain.
        body: JSON.stringify(map)
      })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('의견 전달 API 요청이 실패했습니다.');
            }
        })
        .then((data) => {
            console.log(data);
            alert("의견이 제출 되었습니다.")
        })
        .catch((error) => {
          console.error(error);
        });
}

function gosingo(href, list){
    fetch(SERVER_HOST + '/api/singo/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // mode : 'no-cors', // Do not send CSRF token to another domain.
        body: JSON.stringify({ 
          "href" : href,
          "list" : list
        })
      })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('신고 API 요청이 실패했습니다.');
            }
        })
        .then((data) => {
            console.log(data);
            alert("신고 되었습니다.")
        })
        .catch((error) => {
          console.error(error);
        });
}
