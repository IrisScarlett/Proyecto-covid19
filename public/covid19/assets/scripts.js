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
        const response = await fetch (`http://localhost:3000/api/countries/${country}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
        const {data} = await response.json()
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
            dataPoints: [
                {y: infoCountry.active, label: "Activos"},
                {y: infoCountry.deaths, label: "Muertes"},
                {y: infoCountry.recovered, label: "Recuperados"},
                {y: infoCountry.confirmed, label: "Confirmados"}
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
        <td><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" onclick="cargarDatos('${row.location}')">
        Ver detalles
      </button></td>
        </tr>`;
    })
    $(`#${table} tbody`).append(rows);
}

