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
   
    const Total = await getTotal();
    const casosImportantes = Total.filter(function(element){
        return element.active >= 10000;
    })
    console.log('miau', casosImportantes);

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
            name: "Casos activos",
            legendText: "Casos activos",
            showInLegend: true, 
            dataPoints:[
                { label: "Saudi", y: 266.21 },
                { label: "Venezuela", y: 302.25 },
                { label: "Iran", y: 157.20 },
                { label: "Iraq", y: 148.77 },
                { label: "Kuwait", y: 101.50 },
                { label: "UAE", y: 97.8 },
              {label: "USA", y: 100.2}
            ]
        },
        {
            type: "column",	
            name: "Casos confirmados",
            legendText: "Casos confirmados",
            axisYType: "secondary",
            showInLegend: true,
            dataPoints:[
                { label: "Saudi", y: 10.46 },
                { label: "Venezuela", y: 2.27 },
                { label: "Iran", y: 3.99 },
                { label: "Iraq", y: 4.45 },
                { label: "Kuwait", y: 2.92 },
                { label: "UAE", y: 3.1 },
              {label: "USA", y: 3.4}
            ]
        },
        {
            type: "column",	
            name: "Casos muertos",
            legendText: "Casos muertos",
            axisYType: "secondary",
            showInLegend: true,
            dataPoints:[
                { label: "Saudi", y: 10.46 },
                { label: "Venezuela", y: 2.27 },
                { label: "Iran", y: 3.99 },
                { label: "Iraq", y: 4.45 },
                { label: "Kuwait", y: 2.92 },
                { label: "UAE", y: 3.1 },
              {label: "USA", y: 3.4}
            ]
        },
        {
            type: "column",	
            name: "Casos recuperados",
            legendText: "Casos recuperados",
            axisYType: "secondary",
            showInLegend: true,
            dataPoints:[
                { label: "Saudi", y: 10.46 },
                { label: "Venezuela", y: 2.27 },
                { label: "Iran", y: 3.99 },
                { label: "Iraq", y: 4.45 },
                { label: "Kuwait", y: 2.92 },
                { label: "UAE", y: 3.1 },
              {label: "USA", y: 3.4}
            ]
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