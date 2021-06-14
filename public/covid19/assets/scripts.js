const getTotal = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/total', {
            method: 'GET'
        })

        const {
            data
        } = await response.json()

        if (data) {
            //console.log(data)
            return data;
        }
    } catch (err) {
        console.error(`Error: ${err}`)
    }
}



const Grafica = async () => {
    var dataPoints1 = [];
    var dataPoints2 = [];
    var dataPoints3 = [];
    var dataPoints4 = [];

    const Total = await getTotal();
    const casosImportantes = Total.filter(function (element) {
        return element.active >= 10000;
    })
    //console.log(casosImportantes);


    for (let i = 0; i < casosImportantes.length; i++) {
        let activos = casosImportantes[i].active;
        let confirmados = casosImportantes[i].confirmed;
        let muertes = casosImportantes[i].deaths;
        let recuperados = casosImportantes[i].recovered;
        let pais = casosImportantes[i].location;
        let punto1 = {'label': pais, 'y': activos};
        let punto2 = {'label': pais, 'y': confirmados};
        let punto3 = {'label': pais, 'y': muertes};
        let punto4 = {'label': pais, 'y': recuperados};
        dataPoints1.push(punto1);
        dataPoints2.push(punto2);
        dataPoints3.push(punto3);
        dataPoints4.push(punto4);
    }


     var chart = new CanvasJS.Chart("chartCovid", {
         animationEnabled: true,
         title:{
             text: "Covid19"
         },	
       
         toolTip: {
             shared: true
         },
         legend: {
             cursor:"pointer",
             itemclick: toggleDataSeries
         },
         data: [{
             type: "column",
             toolTipContent : 'ver detalle',
             name: "Casos activos",
             legendText: "Casos activos",
             showInLegend: true, 
             dataPoints: dataPoints1,
         },
         {
             type: "column",
             toolTipContent : null,	
             name: "Casos confirmados",
             legendText: "Casos confirmados",
             axisYType: "secondary",
             showInLegend: true,
             dataPoints: dataPoints2,
         },
         {
             type: "column",
             toolTipContent : null,	
             name: "Casos muertos",
             legendText: "Casos muertos",
             axisYType: "secondary",
             showInLegend: true,
             dataPoints: dataPoints3,
         },
         {
             type: "column",	
             toolTipContent : null,
             name: "Casos recuperados",
             legendText: "Casos recuperados",
             axisYType: "secondary",
             showInLegend: true,
             dataPoints: dataPoints4,
         },]
     });
     chart.render();
     
     function toggleDataSeries(e) {
         if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
             e.dataSeries.visible = false;
         }
         else {
             e.dataSeries.visible = true;
         }
         chart.render();
     }
}

Grafica();