const path = require('path')
const os = require('os')
const fs = require('fs')
const {
    ipcRenderer
} = require('electron')

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);

});

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
});


const form = document.getElementById("image-form")
const result = document.querySelector(".output")
var img = document.createElement('img')
var p = document.createElement('p')
var table = document.createElement('table')



var dir = os.homedir() + "/Molecule/Crusher"

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

function text1() {

    let csv1 = document.getElementById('csv1')
    const selected = document.querySelector(".validate")
    let filepath = csv1.files[0].path
    var name = path.basename(filepath)
    selected.value = name

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

    fs.copyFile('\\\\us.ad.lfg.com\\dfs-dept\\ISVSystems\\GIS\\PythonScripts\\Closer.exe', dir + "\\" + "Closer.exe", function (err) {
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

    e.preventDefault();

    var submit = document.getElementById('submit')
    submit.disabled = true;


    var inputs = document.getElementById('csv1')
    let csv1 = document.getElementById('csv1')
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
    p.textContent = "Flashing....!! Please standby."

    result.appendChild(img)
    result.appendChild(p)
    var e = document.getElementsByClassName("browser-default")[0]
    var strUser = e.options[e.selectedIndex].value
    console.log(strUser)

    fs.writeFileSync(dir + "/" + "value.txt", strUser)

    ipcRenderer.send('Crusher')


})

ipcRenderer.on('Crushed', (e, logs) => {


    let csv1 = document.getElementById('csv1')
    let filepath = csv1.files[0].path
    var name = path.basename(filepath)

    try {

        fs.unlinkSync(dir + "/" + name)
    } catch (e) {


    }

    try {

        fs.unlinkSync(dir + "/" + "value.txt")
    } catch (e) {


    }

    try {

        fs.unlinkSync(dir + "/" + "Closer.exe")
    } catch (e) {


    }

    try {

        fs.unlinkSync(dir + "/" + "chromedriver.exe")
    } catch (e) {


    }

    if (result.childElementCount > 0) {
        try {

            result.removeChild(img)
            result.removeChild(p)
            p.innerHTML = ""
            img.innerHTML = ""


        } catch (e) {

        }
    }


    if (logs.err) {

        p.textContent = "Previous run threw error..!! Kindly validate the excel attached and also verify if any CRs are already closed in process"

        result.appendChild(p)

    } else {

        if (logs.data == "Empty DataFrame Columns: [Mailbox, Producer] Index: []") {
            p.textContent = "Vola!Check your draft"
        } else {

            p.textContent = logs.data

        }
        result.appendChild(p)

    }
})