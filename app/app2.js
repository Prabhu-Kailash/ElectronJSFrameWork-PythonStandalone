const path = require('path')
const os = require('os')
const fs = require('fs')
const {
    ipcRenderer
} = require('electron')

const yaml = require('js-yaml')

const customTitlebar = require('custom-electron-titlebar')

var titlebar = new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#bca4a4'),
    icon: '../icons/molecule.png',
    unfocusEffect: true,
    titleHorizontalAlignment: 'left'
})


const form = document.getElementById("image-form")
const result = document.querySelector(".output")
var img = document.createElement('img')
var p = document.createElement('p')
var table = document.createElement('table')

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
});

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.datepicker');
    var options = {
        format: 'yyyy-mm-dd',
        autoClose: true,
        onClose: function () {
            console.log(document.querySelectorAll('.datepicker')[0].value)

        }

    }
    var instances = M.Datepicker.init(elems, options);

});


document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.timepicker');
    var option = {
        format: 'HH:mm:ss',
        autoClose: true,
    }
    var instances = M.Timepicker.init(elems, option);
});


var dir = os.homedir() + "/Molecule/CRs"

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
} else {
    console.log("Dir exist")
}

fs.readdir(dir, (err, files) => {
    if (err) {
        console.log(err)
    }
    for (const file of files) {
        fs.unlink(path.join(dir, file), err => {
            if (err) {
                console.log(err)
            }
        })
    }
})





function text() {

    let csv1 = document.getElementById('csv')
    const selected = document.querySelector(".validate")
    let filepath = csv1.files[0].path
    var name = path.basename(filepath)
    selected.value = name

    fs.copyFile('\\\\us.ad.lfg.com\\dfs-dept\\ISVSystems\\GIS\\PythonScripts\\build.exe', dir + "\\" + "build.exe", function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("Successful")
        }
    })

    fs.copyFile('\\\\us.ad.lfg.com\\dfs-dept\\ISVSystems\\GIS\\PythonScripts\\Network.exe', dir + "\\" + "Network.exe", function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("Successful")
        }
    })

    fs.copyFile('\\\\us.ad.lfg.com\\dfs-dept\\ISVSystems\\GIS\\L1_Team\\Selenium Automation\\chromedriver.exe', dir + "\\" + "chromedriver.exe", function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("Successful")
        }
    })


}


form.addEventListener('submit', (e) => {

    var isChecked = document.querySelector("#myswitch").checked

    var submit = document.getElementById('submit')
    submit.disabled = true;
    var inputs1 = document.getElementById('email_inline')
    var textareas = document.querySelectorAll('.datepicker')[0]
    var textareas1 = document.querySelectorAll('.timepicker')[0]
    let csv1 = document.getElementById('csv')
    let filepath = csv1.files[0].path
    var name = path.basename(filepath)
    fs.copyFile(filepath, dir + "\\" + name, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("Successful")
        }
    })




    if (result.childElementCount > 0) {
        try {

            table.innerHTML = ""
            result.removeChild(img)
            result.removeChild(p)
            p.innerHTML = ""
            img.innerHTML = ""


        } catch (e) {

        }

    }


    img.src = "Molecule.gif"
    img.className = 'chemical'
    p.textContent = "It's brewing...!!"

    result.appendChild(img)
    result.appendChild(p)


    var time = []
    time = document.querySelectorAll('.timepicker')[0].value.split(" ")

    console.log(time[0] + ":00" + " " + time[1])

    fs.writeFileSync(dir + "/" + "value.txt", document.querySelectorAll('.datepicker')[0].value + " " + document.getElementById("email_inline").value + " " + time[0] + ":00" + " " + time[1])

    ipcRenderer.send('Python', {
        isChecked
    })

    e.preventDefault();

})

ipcRenderer.on('python:done', (e, logs) => {

    let csv1 = document.getElementById('csv')
    let filepath = csv1.files[0].path
    var name = path.basename(filepath)

    try {

        fs.unlinkSync(dir + "/" + "build.exe")
    } catch (e) {


    }

    try {

        fs.unlinkSync(dir + "/" + "Network.exe")
    } catch (e) {


    }

    try {

        fs.unlinkSync(dir + "/" + "chromedriver.exe")
    } catch (e) {


    }

    try {

        fs.unlinkSync(dir + "/" + name)
    } catch (e) {


    }

    try {

        fs.unlinkSync(dir + "/" + "value.txt")
    } catch (e) {


    }


    if (result.childElementCount > 0) {
        try {

            table.innerHTML = ""
            result.removeChild(img)
            result.removeChild(p)
            p.innerHTML = ""
            img.innerHTML = ""


        } catch (e) {

        }
    }

    console.log(logs.err)
    console.log(logs.data)
    if (logs.err) {

        p.textContent = "Previous run threw error..!! Kindly validate the CRs raised in outlook folder after few mins and rerun with CSV for which aren't completed."

        result.appendChild(p)

    } else {
        var th1 = document.createElement('th')
        th1.appendChild(document.createTextNode('CR Output'))
        var out = fs.readFileSync(dir + "/" + "changeraised.txt", 'utf8')
        console.log(out)
        var array = out.split("\\n")
        var ty = []
        for (i = 0; i < array.length; i++) {
            ty[i] = document.createElement('tr')
            ty[i].appendChild(document.createTextNode(array[i]))
            th1.appendChild(ty[i])

        }

        if (result.childElementCount > 0) {
            try {

                table.innerHTML = ""
                result.removeChild(img)
                result.removeChild(p)
                p.innerHTML = ""
                img.innerHTML = ""


            } catch (e) {

            }
        }

        table.appendChild(th1)
        result.appendChild(table)

    }


});