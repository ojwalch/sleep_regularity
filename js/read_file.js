
var barValue = 0.0;

function setSummary(sri){
    var ctx = document.getElementById("summary").innerHTML += ", " + (sri).toFixed(2) + "";
}

function setFilename(filename){
    console.log(filename);
    var ctx = document.getElementById("summary").innerHTML += "<br>" + filename; 
}


if (window.File && window.FileReader && window.FileList && window.Blob) {

    function showFile() {
        var preview = document.getElementById('show-text');
        
        var files = document.querySelector('input[type=file]').files;

        var ctx = document.getElementById("summary").innerHTML = "<b>Uploaded file name, Sleep Regularity Index [0 - 100]</b><br>";

        
        for (let j = 0; j < files.length; j++){
            var file = files[j];
            let filename = file.name;

            var reader = new FileReader();
            var textFile = /text.*/;

            var excelFile = /application.*/;

            console.log(file);
            if (file.type.match(textFile) || file.type.match(excelFile)) {

                reader.onload = function (event) {

                    var worker = new Worker('./js/prep_data.js');
                    worker.onmessage = function (e) {

                            const {filename, sri} = e.data;
                            console.log(e.data);
                            setFilename(filename);
                            setSummary(sri);

                    };
                    
                    let rawData = event.target.result;
                    worker.postMessage({rawData, filename});
                }
            } else {
                preview.innerHTML = "<span class='error'>It doesn't seem to be a text file!</span>";
            }
            reader.readAsText(file);
        }
    }
} else {
    alert("Your browser is too old to support HTML5 File API");
}
