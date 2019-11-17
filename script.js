
var container = document.querySelector('.container');

var branch = 'Cse';
var batch = '18';
var data;
var xhr;

var you = document.querySelector('#you');
var you_id = localStorage.getItem('you_id') | '';

var limit = 500;

if(you_id){
    // document.querySelector('#rem').style.display = 'none';
    document.querySelector('#rem').innerText = "Hi," + you_id; 

}

function save(){
    tmp = prompt("Enter Your Roll No. to Remember you on this device. Tip- you can always change roll no by clicking on your info.");
    you_id = tmp != ''? tmp: you_id;
    localStorage.setItem('you_id',you_id);
    change();
}



function change(){
    limit = 500;
    clear();
    branch = document.querySelector('#branch').value;
    batch = document.querySelector('#batch').value;
    xhr = new XMLHttpRequest();

    if(branch == 'FULL_COLLEGE'){
        xhr.open('get', `./json/${branch}/full_college_cgpi.json`);
    }
    else if(branch == 'FULL_YEAR'){
        xhr.open('get', `./json/${branch}/full_year_batch${batch}_cgpi.json`);
    }
    else{
        xhr.open('get', `./json/${branch}/batch_${batch}_cgpi.json`);
    }

    xhr.send();
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr.status == 200){
                data = JSON.parse(xhr.responseText);
                limit =  (limit < data.length)?limit:data.length;

                if(data.length > 499){
                    document.querySelector('.nav').style.display = 'flex';
                }
                else{
                    document.querySelector('.nav').style.display = 'none';
                }

                let i =0;
                let f=0;
                for (const stud of data) {
                    container.append(create(stud));
                    if(you_id == stud.Rollno){
                        you.innerHTML = "";
                        you.appendChild(create(stud));
                        f=1;
                    }
                    i++;
                    if(!f)
                        you.innerHTML = "";
                    if(i>limit) break;
                }

            }                  
            
        }
    }
}

document.addEventListener('keyup', function(e){
    let divs = document.querySelectorAll('.container > div');
    let ip = String(document.querySelector('input[type=search]').value).toUpperCase();

    for (var div of divs) {
        str = String(div.innerText).toUpperCase();
        if(str.indexOf(ip) > -1){
            div.style.display = "block";
        }
        else{
            div.style.display = "none";
        }
    }
});

function clear(){
    let divs = document.querySelectorAll('.container > div');

    for (var div of divs) {
        div.parentElement.removeChild(div);
    }
}

function create(stud){
    let node = document.createElement('div');
    let Name = document.createElement('div'); Name.className = "Name"; Name.innerText = stud.Name.split('S/D')[0];
    let Rollno = document.createElement('div'); Rollno.className = "Rollno"; Rollno.innerText = stud.Rollno;
    let Rank = document.createElement('div'); Rank.className = "Rank"; Rank.innerText = '#_'+stud.Rank;
    let Cgpa = document.createElement('div'); Cgpa.className = "Cgpa"; Cgpa.innerText = stud.Cgpa; 
    let Sgpa = document.createElement('div'); Sgpa.className = "Sgpa"; Sgpa.innerText = stud.Sgpa; 
    let Points = document.createElement('div'); Points.className = "Points"; Points.innerText = stud.Points; 
    if(branch == 'FULL_COLLEGE'){
        let Branch  = document.createElement('div'); Branch.className = "Branch"; Branch.innerText = stud.Branch; 
        let Year = document.createElement('div'); Year.className = "Year"; Year.innerText = stud.Year; 
        node.append(Rank,Name,Rollno,Branch,Year,Points,Sgpa,Cgpa);
    }
    else if(branch == 'FULL_YEAR'){
        let Branch  = document.createElement('div'); Branch.className = "Branch"; Branch.innerText = stud.Branch;
        node.append(Rank,Name,Rollno,Branch,Points,Sgpa,Cgpa);
    }
    else{
        node.append(Rank,Name,Rollno,Points,Sgpa,Cgpa);
    }
    
    return node;
    // container.appendChild(node);
}

function next(){
    clear();
    limit +=500;
    limit = (limit>data.length)?data.length:limit;
    for(i=Math.max(0,limit-500);i<limit;++i){
        container.appendChild(create(data[i]));
    }
}

function prev(){
    clear();
    limit -=500;
    limit = limit<500? 500: limit;
    for(i=Math.max(0,limit-500);i<limit;++i){
        container.appendChild(create(data[i]));
    }
}