//Se crea una variable vacía para el JWT
let JWT = '';
//Llamado a la API 
const getTotal = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/total', {
            method: 'GET'
        })

        const {
            data
        } = await response.json()

        if (data) {
            LlenarTabla(data, 'tabla');
            return data;
        }
    } catch (err) {
        console.error(`Error: ${err}`)
    }
}


//Creando función asíncrona
const Grafica = async () => {
    //Creando variables vacías de datos
    let dataPoints1 = [];
    let dataPoints2 = [];
    let dataPoints3 = [];
    let dataPoints4 = [];

    //Creando arreglo de países con más de 10.000 casos activos
    const Total = await getTotal();
    const casosImportantes = Total.filter(function (element) {
        return element.active >= 10000;
    })
    //console.log(casosImportantes);

    //Para mostrar en la gráfica
    for (let i = 0; i < casosImportantes.length; i++) {
        let activos = casosImportantes[i].active;
        let confirmados = casosImportantes[i].confirmed;
        let muertes = casosImportantes[i].deaths;
        let recuperados = casosImportantes[i].recovered;
        let pais = casosImportantes[i].location;
        let punto1 = {
            'label': pais,
            'y': activos
        };
        let punto2 = {
            'label': pais,
            'y': confirmados
        };
        let punto3 = {
            'label': pais,
            'y': muertes
        };
        let punto4 = {
            'label': pais,
            'y': recuperados
        };
        dataPoints1.push(punto1);
        dataPoints2.push(punto2);
        dataPoints3.push(punto3);
        dataPoints4.push(punto4);
    }

    //Creación de gráfico utilizando la librería de CANVASJS
    var chart = new CanvasJS.Chart("chartCovid", {
        animationEnabled: true,
        title: {
            text: "Covid19"
        },

        toolTip: {
            shared: true
        },
        data: [{
                type: "column",
                name: "Casos activos",
                legendText: "Casos activos",
                showInLegend: true,
                dataPoints: dataPoints1,
            },
            {
                type: "column",
                name: "Casos confirmados",
                legendText: "Casos confirmados",
                showInLegend: true,
                dataPoints: dataPoints2,
            },
            {
                type: "column",
                name: "Casos muertos",
                legendText: "Casos muertos",
                showInLegend: true,
                dataPoints: dataPoints3,
            },
            {
                type: "column",
                name: "Casos recuperados",
                legendText: "Casos recuperados",
                showInLegend: true,
                dataPoints: dataPoints4,
            },
        ]
    });
    chart.render();
}

//Llamado a la grafica situacion mundial con mas de 10.000 casos
Grafica();

//Llamada a API country
const getCountry = async (country) => {
    let jwt = localStorage.getItem('jwt-token');
    try {
        const response = await fetch(`http://localhost:3000/api/countries/${country}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
        const {
            data
        } = await response.json()
        return data
    } catch (err) {
        console.error(`Error: ${err}`)
    }
}


//Para cargar la grafica del modal
const cargarDatos = async (country) => {
    let infoCountry = await getCountry(country);


    var chart = new CanvasJS.Chart("chartDetalle", {
        animationEnabled: true,
        title: {
            text: `Detalle de ${country}`
        },
        data: [{
            type: "pie",
            startAngle: 240,
            yValueFormatString: "##0.00\"%\"",
            indexLabel: "{label} {y}",
            dataPoints: [{
                    y: infoCountry.active,
                    label: "Activos"
                },
                {
                    y: infoCountry.deaths,
                    label: "Muertes"
                },
                {
                    y: infoCountry.recovered,
                    label: "Recuperados"
                },
                {
                    y: infoCountry.confirmed,
                    label: "Confirmados"
                }
            ]
        }]
    });
    chart.render();

}


//Llenado de tabla con situacion mundial
const LlenarTabla = async (data, table) => {
    let rows = "";
    $.each(data, async (i, row) => {
        rows += `<tr>
        <td>${row.location}</td>
        <td>${row.confirmed}</td>
        <td>${row.deaths}</td>
        <td>${row.recovered}</td>
        <td>${row.active}</td>
        <td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#tablaModal" onclick="cargarDatos('${row.location}')">
        Ver detalles
      </button></td>
        </tr>`;
    })
    $(`#${table} tbody`).append(rows);
}


//Llamado a la API de LOGIN
const postData = async (email, password) => {
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        const {
            token
        } = await response.json()
        //Añandiendo un valor al localStorage
        localStorage.setItem('jwt-token', token)
        return token
    } catch (err) {
        console.error(`Error: ${err}`)
    }
}

//Funcion para el inicio de sesion
$('#js-form').submit(async (event) => {
    event.preventDefault();
    const email = document.getElementById('js-input-email').value;
    const password = document.getElementById('js-input-password').value;
    JWT = await postData(email, password);
})

//Funcion para cambiar el navbar al iniciar sesion

const changeNav = document.getElementById('js-form');
changeNav.addEventListener('submit', () => {
    let change = document.getElementById('navBar');
    change.innerHTML = `
    <li class="nav-item">
     <a class="nav-link" href="#" id='Inicio'>Inicio</a>
          </li>
    <li class="nav-item" id='NavChile' onclick='GraficaChile()'>
            <a class="nav-link" href="#">Situación Chile</a>
          </li>
    <li class="nav-item">
    <a class="nav-link" href="#" id="log-out">Cerrar Sesión</a>
          </li>
    `
    //Logout para recargar página
    $('#log-out').click(async (event) => {
        event.preventDefault();
        JWT = '';
        location.reload()
    })
    $('#Inicio').click(async (event) => {
        event.preventDefault();
        toggleMundialAndChile('sMundial-wrapper', 'sChile-wrapper')
    })
})

//Situacion Chile
let jwt = localStorage.getItem('jwt-token');
//API para confirmados 
const getConfirmed = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/confirmed`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
        const {
            data
        } = await response.json()
        if (data) {
            toggleMundialAndChile('sMundial-wrapper', 'sChile-wrapper')
            return data
        }

    } catch (err) {
        console.error(`Error: ${err}`)
    }
}

//API de muertes
const getDeaths = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/deaths`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
        const {
            data
        } = await response.json()
        return data
    } catch (err) {
        console.error(`Error: ${err}`)
    }
}

//API de recuperados
const getRecovered = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/recovered`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
        const {
            data
        } = await response.json()
        return data
    } catch (err) {
        console.error(`Error: ${err}`)
    }
}

//Grafica Situación Chile
const GraficaChile = async () => {

    let confirmed = await getConfirmed();
    let deaths = await getDeaths();
    let recovered = await getRecovered();

    let data1 = [];
    let data2 = [];
    let data3 = [];

    //Para mostrar en la gráfica confirmados
    for (let i = 0; i < confirmed.length; i++) {
        let fecha = confirmed[i].date;
        let total = confirmed[i].total;
        let punto1 = {
            'label': fecha,
            'y': total
        };
        data1.push(punto1);
    }

    for (let i = 0; i < deaths.length; i++) {
        let fecha = deaths[i].date;
        let total = deaths[i].total;
        let punto2 = {
            'label': fecha,
            'y': total
        };
        data2.push(punto2);
    }

    for (let i = 0; i < recovered.length; i++) {
        let fecha = recovered[i].date;
        let total = recovered[i].total;
        let punto3 = {
            'label': fecha,
            'y': total
        };
        data3.push(punto3);
    }

    var chart = new CanvasJS.Chart("chartChile", {
        theme:"light2",
        animationEnabled: true,
        title:{
            text: "Covid19 en Chile"
        },
        axisY :{
            title: "",
            suffix: ""
        },
        toolTip: {
            shared: "true"
        },
        legend:{
            cursor:"pointer",
            itemclick : toggleDataSeries
        },
        data: [
        {
            type: "spline", 
            showInLegend: true,
            yValueFormatString: "##.",
            name: "Casos confirmados",
            dataPoints: data1
        },
        {
            type: "spline", 
            showInLegend: true,
            yValueFormatString: "##.",
            name: "Muertes",
            dataPoints: data2
        },
        {
            type: "spline", 
            showInLegend: true,
            yValueFormatString: "##.",
            name: "Casos recuperados",
            dataPoints: data3
        }]
    });
    chart.render();
    
    function toggleDataSeries(e) {
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible ){
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        chart.render();
    }

    
}

//Para borrar lo que hay en la pagina y mostrar situacion Chile
const toggleMundialAndChile = (mundial, chile) => {
    $(`#${mundial}`).toggle()
    $(`#${chile}`).toggle()
    }
