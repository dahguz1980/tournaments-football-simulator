
// MENU DE OPCINOES E INICIO DEL SIMULADOR
function menu() {
    let option = 0;

    do {
        option = prompt("Ingresa una de las siguientes opciones: \n1. Simular Eurocopa \n2. Simular de Copa América \n3. Salir")

        switch (option) {
            case "1": simulateEurocopa();
                    break;
            case "2": simulateCopaAmerica();
                    break;
            case "3": alert("Gracias por usar el simulador");
                    break;
            default: alert("Opción inválida");
        }

    } while (option != "3");
}

// SIMULADOR DE EUROCOPA
function simulateEurocopa() {
    const groupA = ["A", ["Turquia", "Italia", "Gales", "Suiza"]];
    const groupB = ["B", ["Belgica", "Dinamarca", "Finlandia", "Rusia"]];
    const groupC = ["C", ["Paises Bajos", "Austria", "Ucrania", "Macedonia del Norte"]];
    const groupD = ["D", ["Inglaterra", "Croacia", "Republica Checa", "Escocia"]];
    const groupE = ["E", ["Suecia", "España", "Eslovaquia", "Polonia"]];
    const groupF = ["F", ["Francia", "Alemania", "Portugal", "Hungría"]];

    const groupStage = [groupA, groupB, groupC, groupD, groupE, groupF];

    simulateGroupStage(groupStage)

}

// SIMULADOR DE COPA AMÉRICA
function simulateCopaAmerica() {
    const groupA = ["A", ["Argentina", "Uruguay", "Paraguay", "Chile","Bolivia"]];
    const groupB = ["B", ["Brasil", "Perú", "Colombia", "Ecuador","Venezuela"]];

    const groupStage = [groupA, groupB];

    simulateGroupStage(groupStage)
}

function simulateGroupStage(groupStage) {
    for (let i = 0; i < groupStage.length; i++) {
        const group = groupStage[i];
        simulateGroup(group[1], group[0]);
    }
}

// PREGUNTA POR LOS POSIBLES RESULTADOS DE UN GRUPO EN PARTICULAR
function simulateGroup(group, idGroup) {
    const points = {};
    let numberOfGames = 1;

    for (let i = 0; i < group.length; i++) {
        points[group[i]] = 0;
    }

    for (let x = 0; x< group.length; x++) {
        for (let y=x+1; y < group.length; y++) {
            
            let score = "a";
            let score2 = "b";
            // Valida que el resultado siempre sea numérico
            while (isNaN(score) || isNaN(score2)) {
                score = parseInt(prompt(`Simular Grupo ${idGroup} \n ${group[x]} Vs ${group[y]} - Cantidad de Goles de ${group[x]}:`))
                score2 = parseInt(prompt(`Simular Grupo ${idGroup} \n ${group[x]} Vs ${group[y]} - Cantidad de Goles de ${group[y]}:`))

                if (isNaN(score) || isNaN(score2)) {
                    alert("La cantidad de goles debe ser un valor numérico")
                }
            }
            
            // Asignación de puntos
            if (score > score2) {
                console.log("Juego No." + numberOfGames + " Ganador " + group[x] + ". 3 puntos ");
                points[group[x]] += 3;  
            } else if (score < score2) {
                console.log("Juego No." + numberOfGames + " Ganador " + group[y] + ". 3 puntos ");
                points[group[y]] += 3;  
            } else {
                console.log("Juego No." + numberOfGames + " Empate " +  group[x] + " " + group[y] + ". 1 punto ");
                points[group[x]] += 1;
                points[group[y]] += 1;
            }

            numberOfGames++;
        
        }
    }

    printGroupResult(points)

}

// IMPRIME LOS RESULTADOS DE MAYOR A MENOR
function printGroupResult (points) {

    const teamAndPoints = [];
    for (const team in points) {
        teamAndPoints.push({ team, points: points[team] });
    }
  
    // Ordenar el array de equipos y puntos de mayor a menor puntaje.
    teamAndPoints.sort((a, b) => b.points - a.points);
  
    // Imprimir los puntos de los equipos ordenados de mayor a menor.
    console.log("Puntos de los equipos (ordenados de mayor a menor):");
    for (const teamPoint of teamAndPoints) {
      console.log(`${teamPoint.team}: ${teamPoint.points} puntos`);
    }
}

