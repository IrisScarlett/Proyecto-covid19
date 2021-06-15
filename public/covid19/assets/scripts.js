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
    const JWT = await postData(email, password);
    console.log(JWT);

})

//Funcion para cambiar el navbar al iniciar sesion

const changeNav = document.getElementById('js-form');
changeNav.addEventListener('submit', () => {
    let change = document.getElementById('navBar');
    change.innerHTML = `
    <li class="nav-item" id='NavChile' onclick='GraficaChile()'>
            <a class="nav-link" href="#">Situación Chile</a>
          </li>
    <li class="nav-item" id='Logout' onclick='logout()'>
     <a class="nav-link" href="#">Cerrar sesión</a>
          </li>
    `
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
        return data
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

const GraficaChile = async () => {

    let confirmed = await getConfirmed();
    let deaths = await getDeaths();
    let recovered = await getRecovered();

    console.log(confirmed[1]);
    console.log(deaths[2]);
    console.log(recovered[3]);

    let data1 = [];
    let data2 = [];
    let data3 = [];

    //Para mostrar en la gráfica confirmados
    for (let i = 0; i < confirmed.length; i++) {
        let fecha = confirmed[i].date;
        let total = casosImportantes[i].total;
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
        let punto2 = {
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
            yValueFormatString: "##.00",
            name: "Muertes",
            dataPoints: [
                { label: "1/22/20", y: 7.94 },
                { label: "Ep. 2", y: 7.29 },
                { label: "Ep. 3", y: 7.28 },
                { label: "Ep. 4", y: 7.82 },
                { label: "Ep. 5", y: 7.89 },
                { label: "Ep. 6", y: 6.71 },
                { label: "Ep. 7", y: 7.80 },
                { label: "Ep. 8", y: 7.60 },
                { label: "Ep. 9", y: 7.66 },
                { label: "Ep. 10", y: 8.89 }
            ]
        },
        {
            type: "spline", 
            showInLegend: true,
            yValueFormatString: "##.00",
            name: "Casos recuperados",
            dataPoints: [
                { label: "1/22/20", y: 10.11 },
                { label: "Ep. 2", y: 9.27 },
                { label: "Ep. 3", y: 9.25 },
                { label: "Ep. 4", y: 10.17 },
                { label: "Ep. 5", y: 10.72 },
                { label: "Ep. 6", y: 10.24 },
                { label: "Ep. 7", y: 12.07 }
            ]
        },
              {
            type: "spline", 
            showInLegend: true,
            yValueFormatString: "##.",
            name: "Season 8",
            dataPoints: [
                { label: "1/22/20", y: 0 },
                { label: "Ep. 2", y: 10.29 },
                { label: "Ep. 3", y: 12.02 },
                { label: "Ep. 4", y: 11.80 },
                { label: "Ep. 5", y: 12.48 },
                { label: "Ep. 6", y: 13.61 }
            ]
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




//Grafica situación Chile



/*
//Para borrar lo que hay en la pagina y mostrar situacion Chile
const toggleMundialAndChile = (mundial, chile) => {
    $(`#${mundial}`).toggle()
    $(`#${chile}`).toggle()
}*/

const init = async () => {
    const token = localStorage.getItem('jwt-token')
    if (token) {
        return token
    }
}
init()