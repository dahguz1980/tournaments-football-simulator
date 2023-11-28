const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
} 

class Simulator  {
    constructor (name, groups) {
        this.name = name;
        this.groups = groups;
    }

    createTableGroups () {
        const groupsContainer = document.getElementById("groupsPhase")
        const THEAD = `<thead class="text-center">
                            <tr>
                                <th scope="col">Selección</th>
                                <th scope="col">Ptos</th>
                                <th scope="col">PJ</th>
                                <th scope="col" class="d-none d-sm-table-cell">PG</th>
                                <th scope="col" class="d-none d-sm-table-cell">PP</th>
                                <th scope="col" class="d-none d-sm-table-cell">PE</th>
                                <th scope="col" class="d-none d-sm-table-cell">GF</th>
                                <th scope="col" class="d-none d-sm-table-cell">GE</th>
                                <th scope="col">Dif</th>
                            </tr>
                        </thead>`

        this.groups.forEach(element => {
            // create div container for every group
            let div = document.createElement("div");
            div.className = "table-responsive with-responsive"
            
            // create title
            let h2 = document.createElement("h2")
            h2.className = "text-center text-secondary m-4"
            h2.innerText = `Grupo ${element.name}`;
            div.appendChild(h2);
            
            // create table for groups information
            let table = document.createElement("table")
            table.className = "table"
            table.innerHTML = THEAD;
            let TBODY = document.createElement("TBODY");


            // for each teams
            element.teams.forEach (teams => {
                
                let tr = `<tr>`;

                if (teams.clasified && !teams.isThird) {
                    tr = `<tr class="table-success">`;
                }  else if (teams.clasified) {
                    tr = `<tr class="table-info">`;
                }

                tr = tr + `<td class="d-flex align-items-center justify-content-start"><img src="${teams.flag}" width="16px" height="16px">&nbsp; ${teams.name} </td>
                            <td class="text-center">${teams.points}</td>
                            <td class="text-center">${teams.gamesPlayed}</td>
                            <td class="text-center d-none d-sm-table-cell">${teams.wins}</td>
                            <td class="text-center d-none d-sm-table-cell">${teams.losses}</td>
                            <td class="text-center d-none d-sm-table-cell">${teams.draws}</td>
                            <td class="text-center d-none d-sm-table-cell">${teams.goalsFor}</td>
                            <td class="text-center d-none d-sm-table-cell">${teams.goalsAgainst}</td>
                            <td class="text-center">${teams.goalsDifference}</td>
                        </tr>`;
                TBODY.innerHTML += tr;
            })
    
            table.append(TBODY);
            div.appendChild(table);

            // append to the groupsContainer
            groupsContainer.appendChild(div);

            // append games
            element.calendar.forEach (game  => {
                const divGame =    `<div class="simulate-group border-top w-75 row p-2 text-center">
                                        <div class="col-3">${game.gameDate}</div>
                                        <div class="col-6 row">
                                            <div class="col-5 text-right"><img src="${game.localFlag}" width="16px" height="16px">&nbsp;${game.local}</div>
                                            <div class="d-flex justify-content-between col-2"><input type="text" class="form-control" value="${game.goalsLocal}"> - <input type="text" class="form-control" value="${game.goalsVisitor}"></div>
                                            <div class="col-5 text-left"><img src="${game.visitorFlag}" width="16px" height="16px">&nbsp;${game.visitor}</div>
                                        </div>
                                        <div class="col-3">${game.gamePlace}</div>
                                    </div>`

                groupsContainer.innerHTML += divGame;

            })
        });

    }
}

class Calendar {
    constructor (local, visitor, gameDate, gamePlace, goalsLocal, goalsVisitor) {
        this.local = local;
        this.localFlag = `../assets/img/${removeAccents(local).replace(/\s+/g, "")}.webp`
        this.visitor = visitor;
        this.visitorFlag = `../assets/img/${removeAccents(visitor).replace(/\s+/g, "")}.webp`
        this.gameDate = gameDate;
        this.gamePlace = gamePlace;
        this.goalsLocal = goalsLocal;
        this.goalsVisitor = goalsVisitor;
    }
}

class Team {
    constructor(name,  gamesPlayed, wins, draws, losses, goalsFor, goalsAgainst, points) {
        this.name = name;
        this.flag =`../assets/img/${removeAccents(name).toLowerCase().replace(/\s+/g, "")}.webp`;
        this.gamesPlayed = gamesPlayed;
        this.wins = wins;
        this.draws = draws;
        this.losses = losses;
        this.goalsFor = goalsFor;
        this.goalsAgainst = goalsAgainst;
        this.goalsDifference = goalsFor - goalsAgainst;
        this.points = points;
        this.clasified = false;
        this.isThird = false;
    }

    updateValues (gamesPlayed, wins, draws, losses, goalsFor, goalsAgainst, points) {
        this.gamesPlayed += gamesPlayed;
        this.wins += wins;
        this.draws += draws;
        this.losses += losses;
        this.goalsFor += goalsFor;
        this.goalsAgainst += goalsAgainst;
        this.goalsDifference += goalsFor - goalsAgainst;
        this.points += points;
    }

}

class Group {
    constructor(name, teams, calendar){
        this.name = name;
        this.teams = teams;
        this.calendar = calendar;
    }
}

function createCalendar(groupName) {
    let game1, game2, game3, game4, game5,game6 = "";

        switch(groupName) {
            case "A":   game1 = new Calendar ("Turquía", "Italia", "11 de junio de 2021 21:00", "Estadio Olímpico, Roma",0,0);
                        game2 = new Calendar ("Gales","Suiza", "12 de junio de 2021 15:00", "Estadio Olímpico, Bakú",0,0);
                        game3 = new Calendar ("Turquía","Gales", "16 de junio de 2021 18:00", "Estadio Olímpico, Bakú",0,0);
                        game4 = new Calendar ("Italia", "Suiza", "16 de junio de 2021 21:00", "Estadio Olímpico, Roma",0,0);
                        game5 = new Calendar ("Suiza","Turquía", "20 de junio de 2021 18:00", "Estadio Olímpico, Bakú",0,0);
                        game6 = new Calendar ("Italia", "Gales", "20 de junio de 2021 18:00", "Estadio Olímpico, Roma",0,0);

                        break;

            case "B":   game1 = new Calendar ("Dinamarca", "Finlandia", "12 de junio de 2021 18:00", "Parken Stadion, Copenhague",0,0);
                        game2 = new Calendar ("Bélgica","Rusia", "12 de junio de 2021 21:00", "Estadio Krestovski, San Petersburgo",0,0);
                        game3 = new Calendar ("Finlandia","Rusia", "16 de junio de 2021 15:00", "Estadio Krestovski, San Petersburgo",0,0);
                        game4 = new Calendar ("Dinamarca", "Bélgica", "17 de junio de 2021 18:00", "Parken Stadion, Copenhague",0,0);
                        game5 = new Calendar ("Rusia", "Dinamarca", "21 de junio de 2021 21:00", "Parken Stadion, Copenhague",0,0);
                        game6 = new Calendar ("Finlandia","Bélgica", "21 de junio de 2021 21:00", "Estadio Krestovski, San Petersburgo",0,0);
            
                        break;
                        
            case "C":   game1 = new Calendar ("Austria", "Macedonia del Norte", "13 de junio de 2021 18:00", "Arena Națională, Bucarest",0,0);
                        game2 = new Calendar ("Países Bajos","Ucrania", "13 de junio de 2021 21:00", "Johan Cruyff Arena, Ámsterdam",0,0);
                        game3 = new Calendar ("Ucrania","Macedonia del Norte", "17 de junio de 2021 15:00", "Arena Națională, Bucarest",0,0);
                        game4 = new Calendar ("Países Bajos", "Austria", "17 de junio de 2021 21:00", "Johan Cruyff Arena, Ámsterdam",0,0);
                        game5 = new Calendar ("Macedonia del Norte","Países Bajos", "21 de junio de 2021 18:00", "Johan Cruyff Arena, Ámsterdam",0,0);
                        game6 = new Calendar ("Ucrania", "Austria", "21 de junio de 2021 18:00", "Arena Națională, Bucarest",0,0);

                        break;

            case "D":   game1 = new Calendar ("Inglaterra", "Croacia", "13 de junio de 2021 15:00", "Estadio de Wembley, Londres",0,0);
                        game2 = new Calendar ("Escocia","República Checa", "14 de junio de 2021 15:00", "Hampden Park, Glasgow",0,0);
                        game3 = new Calendar ("Croacia","República Checa", "18 de junio de 2021 18:00", "Hampden Park, Glasgow",0,0);
                        game4 = new Calendar ("Inglaterra", "Escocia", "18 de junio de 2021 21:00", "Estadio de Wembley, Londres",0,0);
                        game5 = new Calendar ("Croacia","Escocia", "22 de junio de 2021 21:00", "Hampden Park, Glasgow",0,0);
                        game6 = new Calendar ("República Checa", "Inglaterra", "22 de junio de 2021 21:00", "Estadio de Wembley, Londres",0,0);

                        break;

            case "E":   game1 = new Calendar ("Polonia", "Eslovaquia", "14 de junio de 2021 18:00", "Estadio Krestovski, San Petersburgo",0,0);
                        game2 = new Calendar ("España","Suecia", "14 de junio de 2021 21:00", "Estadio La Cartuja, Sevilla",0,0);
                        game3 = new Calendar ("Suecia","Eslovaquia", "18 de junio de 2021 15:00", "Estadio Krestovski, San Petersburgo",0,0);
                        game4 = new Calendar ("España", "Polonia", "19 de junio de 2021 21:00", "Estadio La Cartuja, Sevilla",0,0);
                        game5 = new Calendar ("Eslovaquia","España", "23 de junio de 2021 18:00", "Estadio La Cartuja, Sevilla",0,0);
                        game6 = new Calendar ("Suecia", "Polonia", "23 de junio de 2021 18:00", "Estadio Krestovski, San Petersburgo",0,0);

                        break;

            case "F":   game1 = new Calendar ("Hungría", "Portugal", "15 de junio de 2021 18:00", "Puskás Aréna, Budapest",0,0);
                        game2 = new Calendar ("Francia","Alemania", "15 de junio de 2021 21:00", "Allianz Arena, Múnich",0,0);
                        game3 = new Calendar ("Hungría","Francia", "19 de junio de 2021 15:00", "Puskás Aréna, Budapest",0,0);
                        game4 = new Calendar ("Portugal", "Alemania", "19 de junio de 2021 18:00", "Allianz Arena, Múnich",0,0);
                        game5 = new Calendar ("Portugal","Francia", "23 de junio de 2021 21:00", "Puskás Aréna, Budapest",0,0);
                        game6 = new Calendar ("Alemania", "Hungría", "23 de junio de 2021 21:00", "Allianz Arena, Múnich",0,0);

                        break;
            
        }

        
        return [game1,game2,game3,game4,game5,game6]
    
}

function createTeams(teams) {
    let teamList = []
    if (teams.length>0) {
        for (const team of teams) {
            teamList.push(new Team(team, 0,0,0,0,0,0,0));
        }
    }

    return teamList;
}

function createEuroGroups()  {
    const GROUP_A = new Group("A",createTeams(["Turquía","Italia","Gales","Suiza"]),createCalendar("A"));
    const GROUP_B = new Group("B",createTeams(["Bélgica","Dinamarca","Finlandia","Rusia"]),createCalendar("B"));
    const GROUP_C = new Group("C",createTeams(["Países Bajos","Austria","Ucrania","Macedonia del Norte"]),createCalendar("C"));
    const GROUP_D = new Group("D",createTeams(["Inglaterra","Croacia","República Checa","Escocia"]),createCalendar("D"));
    const GROUP_E = new Group("E",createTeams(["Suecia","España","Eslovaquia","Polonia"]),createCalendar("E"));
    const GROUP_F = new Group("F",createTeams(["Francia","Alemania","Portugal","Hungría"]),createCalendar("F"));


    return [GROUP_A, GROUP_B, GROUP_C, GROUP_D, GROUP_E, GROUP_F]
}

// SIMULADOR DE EUROCOPA
function initEurocopa() {
    const sim = new Simulator("Eurocopa",createEuroGroups());
    simulateGroupStage(sim.groups);
    sim.createTableGroups();
}


function simulateGroupStage(groups) {

    for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        simulateGroup(group);
    }

    getBestThird(groups);

}

// PREGUNTA POR LOS POSIBLES RESULTADOS DE UN GRUPO EN PARTICULAR
function simulateGroup(group) {
    const teams = group.teams;
    const calendar = group.calendar;

    for (const game of calendar) {

        do {
            game.goalsLocal = parseInt(prompt(`Simular Grupo ${group.name} \n ${game.local} Vs ${game.visitor} - Cantidad de Goles de ${game.local}:`))
            game.goalsVisitor = parseInt(prompt(`Simular Grupo ${group.name} \n ${game.local} Vs ${game.visitor} - Cantidad de Goles de ${game.visitor}:`))

            if (isNaN(game.goalsLocal) || isNaN(game.goalsVisitor)) {
                alert("La cantidad de goles debe ser un valor numérico")
            }
        } while (isNaN(game.goalsLocal) || isNaN(game.goalsVisitor))

        const teamLocal = teams.find((team) => team.name === game.local );
        const teamVisitor = teams.find((team) =>  team.name === game.visitor);
           
        // Asignación de puntos
        if (game.goalsLocal > game.goalsVisitor) {
            console.log(" Ganador " + game.local + ". 3 puntos ");
            teamLocal.updateValues(1,1,0,0,game.goalsLocal,game.goalsVisitor,3);
            teamVisitor.updateValues(1,0,0,1,game.goalsVisitor,game.goalsLocal,0);
        } else if (game.goalsLocal < game.goalsVisitor) {
            console.log("Ganador " + game.visitor + ". 3 puntos ");
            teamLocal.updateValues(1,0,0,1,game.goalsLocal,game.goalsVisitor,0);
            teamVisitor.updateValues(1,1,0,0,game.goalsVisitor,game.goalsLocal,3);
        } else {
            console.log("Empate " +  game.local + " " + game.visitor + ". 1 punto ");
            teamLocal.updateValues(1,0,1,0,game.goalsLocal,game.goalsVisitor,1);
            teamVisitor.updateValues(1,0,1,0,game.goalsVisitor,game.goalsLocal,1);
        }

    }

    teams.sort((a, b) => b.points - a.points);
    markTeamsClasified(teams.slice(0,2), false);
    
    
}

// Función para obtener el mejor tercero según las reglas de la UEFA
function getBestThird(groups) {
    // Obtener todos los equipos terceros
    const third = groups.map(group => group.teams[2]);
  
    // Ordenar los terceros por puntos de mayor a menor
    third.sort((a, b) => {
      // Criterio 1: Puntos
      if (a.points !== b.points) {
        return b.points - a.points;
      }
  
      // Criterio 2: Mayor cantidad de goles a favor
      if (a.goalsFor !== b.goalsFor) {
        return b.goalsFor - a.goalsFor;
      }

      return 0;
    });

    // Tomar los cuatro mejores terceros
  const bestThird = third.slice(0, 4);
  markTeamsClasified(bestThird, true);


}

function markTeamsClasified (teamsClasified, isThird) {
  
    for (const team of teamsClasified) {
        console.log("TEAM " + team + " is clasified and is Third " + isThird);
        team.clasified = true;
        team.isThird = isThird;
    }
}