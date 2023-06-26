function addTasks(data){
    data.forEach(function (arrayItem) {
        var x = arrayItem["task"];
        var li = document.createElement("li");
        li.setAttribute("id", arrayItem["_id"]);
        li.setAttribute("class", arrayItem["class"]);
        var inputValue = x;
        var t = document.createTextNode(inputValue);
        li.appendChild(t);
        if (inputValue === '') {
            alert("You must write something!");
        } else {
            document.getElementById("myUL").appendChild(li);
        }
        document.getElementById("input-text").value = "";
        var span = document.createElement("SPAN");
        var txt = document.createTextNode("\u00D7");
        span.className = "close";
        span.appendChild(txt);
        li.appendChild(span);
    })
}

var data=fetch('/getapi')
    .then(response => response.json())
    .then(data => addTasks(data));

var complist=document.getElementById("myUL");
complist.addEventListener('click',function(event){
    if(event.target.tagName=="LI")
    {
        var x=event.target.id;
        var cl=event.target.className;
        if(cl==="checked") cl="unchecked";
        else cl="checked";
        const data={
            'id': x,
            'check': cl
        };
        fetch('/toggle', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        event.target.classList.toggle('checked');
    }
    else if(event.target.tagName=="SPAN")
    {
        var text1=event.target.parentElement.id;
        event.target.parentElement.remove();
        var x=text1;
        const data={
            'use': x
        };
        fetch('/api1', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }
},false);
var mylist = document.getElementsByClassName("list-item");
var i;
for (i = 0; i < mylist.length; i++) {
  var make_span= document.createElement("SPAN");
  var make_txt= document.createTextNode("\u00D7");
  make_span.className = "close";
  make_span.appendChild(make_txt);
  mylist[i].appendChild(make_span);
}
