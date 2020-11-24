const {
    ipcRenderer
} = require('electron')
const path = require('path')
const os = require('os')
const fs = require('fs')

const customTitlebar = require('custom-electron-titlebar')

var titlebar = new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#000000'),
    icon: '../icons/PuppetLogo.png',
    unfocusEffect: true,
    titleHorizontalAlignment: 'left'
})

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
});

var dir = os.homedir() + "/Molecule/BigBang"

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
} else {
    console.log("Dir exist")
}

fs.readdir(dir, (err, files) => {
    if (err) {
        console.log(err)
    } else {
        for (const file of files) {
            fs.unlink(path.join(dir, file), err => {
                if (err) {
                    console.log(err)
                }
            })
        }

    }

})





const form = document.getElementById("image-form")
const result = document.querySelector(".output")
var img = document.createElement('img')
var p = document.createElement('p')


function text() {
    var csv1 = document.getElementById('csv')


    const selected = document.querySelector(".validate")
    let filepath = csv1.files[0].path
    console.log(csv1.files)
    var name = path.basename(filepath)
    selected.value = name
    var dir = os.homedir() + "/Molecule/BigBang"

    fs.copyFile('\\\\us.ad.lfg.com\\dfs-dept\\ISVSystems\\GIS\\PythonScripts\\BigBang.exe', dir + "\\" + "BigBang.exe", function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("Successful")
        }
    })

    for (var m = 0; m < csv1.files.length; m++) {

        fs.copyFile(csv1.files[m].path, dir + "\\" + path.basename(csv1.files[m].path), function (err) {
            if (err) {
                console.log(err)
            } else {
                console.log("Successful")
            }
        })


    }
    


}


form.addEventListener('submit', (e) => {
    


    let csv1 = document.getElementById('csv')
    let filepath = csv1.files[0].path
    var name = path.basename(filepath)
    var radio = document.querySelector('input[name=environment]:checked').value
    var isChecked = document.querySelector("#myswitch").checked


    if (isChecked == false){
        if (radio == "Prod") {
            radio = "MFProd"
        } else if (radio == "PreProd") {
            radio = "MFPreProd"
        }
    }

    console.log(radio)

    var submit = document.getElementById('submit')
    submit.disabled = true;

    if (result.childElementCount > 0) {
        try {
            result.removeChild(img)
            result.removeChild(p)
            p.innerHTML = ""
            img.src = ""
        } catch (m) {

        }

    }



    img.src = "Molecule.gif"
    img.className = 'chemical'
    p.textContent = "Construction in progress"

    result.appendChild(img)
    result.appendChild(p)



    fs.writeFileSync(dir + "/" + "value.txt", radio)

    ipcRenderer.send('BigBang')
    e.preventDefault();

})

ipcRenderer.on('python:BigBang', (e, logs) => {

    let csv1 = document.getElementById('csv')
    let filepath = csv1.files[0].path
    var name = path.basename(filepath)

    try {

        fs.unlinkSync(dir + "/" + "BigBang.exe")
    } catch (e) {


    }

    try {

        fs.unlinkSync(dir + "/" + "value.txt")
    } catch (e) {


    }



    if (result.childElementCount > 0) {
        try {


            result.removeChild(img)
            result.removeChild(p)
            p.innerHTML = ""
            img.src = ""


        } catch (e) {

        }
    }

    console.log(logs.err)
    console.log(logs.data)
    if (logs.err) {

        p.textContent = "Last trial threw error kindly validate"

        result.appendChild(p)

    } else {

        if (result.childElementCount > 0) {
            try {


                result.removeChild(img)
                result.removeChild(p)
                p.innerHTML = ""
                img.src = ""


            } catch (e) {

            }
        }

        p.textContent = "Bang! Kindly check the output folder for the YAML files"

        result.appendChild(p)

    }


});