let sim;
const TOURNAMENT_DATA_URL = "http://129.146.176.182:3000/ft/api/tournaments/list/"

class Simulator {
    constructor(name, tournamentName, date_init, date_end, countries, qtyTeamsClasified, qtyThirdTeamsClasified, groups) {
        this.name = name;
        this.tournamentName = tournamentName;
        this.date_init = date_init;
        this.date_end = date_end;
        this.countries = countries;
        this.qtyTeamsClasified = qtyTeamsClasified;
        this.qtyThirdTeamsClasified = qtyThirdTeamsClasified;
        this.groups = groups;
    }

    createTableGroups() {


        let divTitle = document.getElementById("titleTournament");

        let h1 = document.createElement("h1")
        h1.innerText = this.tournamentName;
        h1.className = 'text-primary'
        divTitle.appendChild(h1);

        let h3 = document.createElement("h3")
        h3.innerText = "Del " + this.date_init + " al " + this.date_end;
        h3.className = 'text-primary'
        divTitle.appendChild(h3);

        let h5 = document.createElement("h5")
        h5.innerText = "Sede(s): " + this.countries;
        h5.className = 'text-primary'
        divTitle.appendChild(h5);

        const groupsContainer = document.getElementById("groupsPhase")


        this.groups.forEach(element => {
            // create div container for the group
            let div = document.createElement("div");
            div.id = `div-standing-${element.name}`
            div.className = "table-responsive with-responsive"
            const divStanding = this.createTableStanding(div, element);
            // append to the groupsContainer
            groupsContainer.appendChild(divStanding);

            // append games
            element.calendars.forEach(game => {
                const divGame = `<div class="simulate-group border-top with-responsive row p-2 text-center">
                                        <div class="col-12 col-xl-3 p-2 p-xl-0">${formatDate(game.gameDate)}</div>
                                        <div class="col-12 col-xl-6 row">
                                            <div class="col-4 text-right"><img src="${game.localFlag}" class="d-none d-sm-inline" width="16px" height="16px">&nbsp;${game.local.slice(0, 3)}</div>
                                            <form class="d-flex justify-content-between col-4">
                                                <input id="${element.name + '_' + game.local.slice(0, 3)}" type="text" class="form-control" value="${game.goalsLocal}" onChange="updateResults(form)"> 
                                                - 
                                                <input id="${element.name + '_' + game.visitor.slice(0, 3)}" type="text" class="form-control" value="${game.goalsVisitor}" onChange="updateResults(form)">
                                            </form>
                                            <div class="col-4 text-left"><img class="d-none d-sm-inline" src="${game.visitorFlag}" width="16px" height="16px">&nbsp;${game.visitor.slice(0, 3)}</div>
                                        </div>
                                        <div class="col-12 col-xl-3 p-2 p-xl-0">${game.gamePlace}</div>
                                    </div>`

                groupsContainer.innerHTML += divGame;

            })
        });

    }

    createTableStanding(div, element) {

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



        // create title
        let h2 = document.createElement("h2")
        h2.className = "text-center text-secondary m-4"
        h2.innerText = `${element.name}`;
        div.appendChild(h2);

        // create table for groups information
        let table = document.createElement("table")
        table.className = "table"
        table.innerHTML = THEAD;
        let TBODY = document.createElement("TBODY");

        // for each teams
        element.teams.forEach(teams => {

            let tr = `<tr>`;

            if (teams.clasified && !teams.isThird) {
                tr = `<tr class="table-success">`;
            } else if (teams.clasified) {
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

        return div;
    }
}

class Calendars {
    constructor(local, visitor, gameDate, gamePlace, goalsLocal, goalsVisitor, winner, losser, draw, localFlag, visitorFlag) {
        this.local = local;
        this.localFlag = localFlag;
        this.visitor = visitor;
        this.visitorFlag = visitorFlag;
        this.gameDate = gameDate;
        this.gamePlace = gamePlace;
        this.goalsLocal = goalsLocal==null?"":goalsLocal;
        this.goalsVisitor = goalsVisitor==null?"":goalsVisitor;
        this.winner = winner==undefined?"":winner;
        this.losser = losser==undefined?"":losser;
        this.draw = draw==undefined?"":draw;
    }

    updateGoals(goalsLocal, goalsVisitor) {

        if (goalsLocal != -1 && goalsVisitor != -1) {

            this.goalsLocal = goalsLocal;
            this.goalsVisitor = goalsVisitor;

            if (goalsLocal > goalsVisitor) {
                this.winner = this.local;
                this.losser = this.visitor;
            } else if (goalsLocal < goalsVisitor) {
                this.losser = this.local;
                this.winner = this.visitor;
            } else {
                this.draw = "1"
                this.losser = "";
                this.winner = "";
            }
        } else {
            this.goalsLocal = "";
            this.goalsVisitor = "";
            this.draw = ""
            this.losser = "";
            this.winner = "";
        }
    }
}

class Team {
    constructor(name, gamesPlayed, wins, draws, losses, goalsFor, goalsAgainst, points, clasified, isThird, flag) {
        this.name = name;
        this.flag = flag;
        this.gamesPlayed = gamesPlayed==null?0:gamesPlayed;
        this.wins = wins==null?0:wins;
        this.draws = draws==null?0:draws;
        this.losses = losses==null?0:losses;
        this.goalsFor = goalsFor==null?0:goalsFor;
        this.goalsAgainst = goalsAgainst==null?0:goalsAgainst;
        this.points = points==null?0:points;
        this.goalsDifference = goalsFor - goalsAgainst;
        this.clasified = clasified;
        this.isThird = isThird;


    }

    updateValues(games) {

        let gamesPlayed = 0;
        let wins = 0;
        let draws = 0;
        let losses = 0;
        let goalsFor = 0;
        let goalsAgainst = 0;
        let points = 0;

        for (const game of games) {

            if ((game.local == this.name || game.visitor == this.name) && (game.winner != "" || game.losser != "" || game.draw == 1)) {

                gamesPlayed += 1;

                if (game.winner === this.name) {
                    wins++;
                    points += 3;

                } else if (game.winner != "") {
                    losses++;
                } else {
                    draws++;
                    points++;
                }

                // Sumar goles dependiendo si el equipo es local o visitante

                if (game.local === this.name) {
                    goalsFor += game.goalsLocal;
                    goalsAgainst += game.goalsVisitor;
                } else if (game.visitor === this.name) {
                    goalsFor += game.goalsVisitor;
                    goalsAgainst += game.goalsLocal;
                }
            }
        }

        this.gamesPlayed = gamesPlayed
        this.wins = wins;
        this.draws = draws;
        this.losses = losses;
        this.goalsFor = goalsFor;
        this.goalsAgainst = goalsAgainst;
        this.goalsDifference = goalsFor - goalsAgainst;
        this.points = points;

    }
}

class Group {
    constructor(name, teams, calendars) {
        this.name = name;
        this.teams = teams;
        this.calendars = calendars;
    }
}

function createCalendars(calendars) {
    let games = []

    calendars.forEach(c => {
        // Valido si es el JSON que viene del API que viene con el dato TeamLocal y TeamVisitor, sino es el que se guarda en el Storage y viene sin esa INFO
        let game = new Calendars(c.teamLocal==undefined?c.local:c.teamLocal.name, 
                                 c.teamVisitor==undefined?c.visitor:c.teamVisitor.name, 
                                 c.gameDate, c.gamePlace, c.goalsLocal, c.goalsVisitor, c.winner, c.losser, c.draw, 
                                 c.teamLocal==undefined?c.localFlag:c.teamLocal.flag, 
                                 c.teamVisitor==undefined?c.visitorFlag:c.teamVisitor.flag);
        games.push(game);
    })

    return games;

}

/**
 *  Crea los equipos a partir de un JSON de equipos
 * @param  teams  (JSON)
 * @returns 
 */
function createTeams(teams) {
    let teamList = []
    if (teams.length > 0) {
        for (const team of teams) {
            teamList.push(new Team(team.name, team.gamesPlayed, team.wins, team.draws, team.losses, team.goalsFor, team.goalsAgainst, team.points, team.clasified, team.isThird, team.flag));
        }
    }

    return teamList;
}

/**
 *  Crea los grupos con los equipos y calendarios de juegos a partir de un JSON
 * @param  groupsInfo  (JSON)
 * @returns 
 */
function createGroups(groupsInfo) {

    let groups = []

    if (groupsInfo != undefined) {
        groupsInfo.forEach(element => {
            let group = new Group(element.name, createTeams(element.teams), createCalendars(element.calendars))
            groups.push(group);
        });

    }

    return groups;
}

// SIMULADOR DE Copa America
function initTournament() {

    // obtener el codigo del torneo desde
    code = document.getElementsByClassName("current")[0].id    

    if (localStorage.getItem(code)) {
       let simJSON =  JSON.parse(localStorage.getItem(code));
       sim =  new Simulator(simJSON.name, simJSON.tournamentName, simJSON.date_init, simJSON.date_end, simJSON.countries, simJSON.qtyTeamsClasified, simJSON.qtyThirdTeamsClasified, createGroups(simJSON.groups));
       sim.createTableGroups();
    } else {
        // Busco en la API la información del torneo deseado
        getTournamentsData(code);
    }
}

function getTournamentsData(tournamentCode) {
    fetch(TOURNAMENT_DATA_URL+tournamentCode)
        .then(response => {
            if (!response.ok) {
            throw new Error('La solicitud no se completó correctamente.');
            }
            return response.json();
        })
        .then(info => {
            // Se crea la simulación con los datos retornados en el JSON
            sim = new Simulator(tournamentCode,  `${info.data.name}`,`${formatLongDate(info.data.date_init)}`, `${formatLongDate(info.data.date_end)}` , `${info.data.countries}` , `${info.data.qty_teams_clasified}`, `${info.data.qty_third_teams_clasified}`, createGroups(info.data.groups));
            sim.createTableGroups();
        })
        .catch(error => {
            // en caso de error se muestra mensaje utilizando la libreria que corresponde
            createMessage("Ocurrió un error al llamar a la API",0)
        });
}


function simulateGroupStage(groups) {

    for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        simulateGroup(group);
    }

    if (sim.qtyThirdTeamsClasified > 0) {
        getBestThird(groups);

    }

}

/**
 * Función que actualiza los resultados según lo que ingresa el usuario. E
 * onChangeEvent asociado a los input del simulador
 * El Formulario que llega desde el evento contiene un array de dos posiciones con los inputs ingresados por el usuario
 * @param e -> Formulario que contiene el resultado de un juego en particular tanto goles de local como de visitante.
 */
function updateResults(e) {

    let isInvalid = false;


    // Obtengo los valores que vienen dentro del formulario, hay un formulario diferente por cada juego.
    let [inputLocal, inputVisitor] = e;

    // Validar si ambos input ya contienen datos validos
    if (inputLocal != undefined && inputVisitor != undefined) {

        // validar que los datos ingresados sean numericos 
        if (!validateIsValidGoal(inputLocal.value) || !validateIsValidGoal(inputVisitor.value)) {
            createMessage("Datos Ingresados Incorrectos, por favor ingrese sólo números",0)
            isInvalid = true;
        }

        //1.- Se obtiene el ID de cada formulario , el ID es de la forma .-. GRUPO_EQUIPOS_VISITOR/LOCAL
        let inputTeamLocalInfo = inputLocal.id.split("_");
        let inputTeamVisitorInfo = inputVisitor.id.split("_");

        //2.- Buscar el grupo: La primera position indica el grupo, segunda posicion las tres primeras letras de cada equipo y la ultima posicion indica si es local o visitante
        // Ambos equipos pertencen al mismo grupo
        const group = sim.groups.find(group => group.name === inputTeamLocalInfo[0])

        // Validamos que se haya encontrado el grupo
        if (group != undefined) {
            //3.- Buscar los equipos
            const teamLocal = group.teams.find((team) => team.name.slice(0, 3) === inputTeamLocalInfo[1]);
            const teamVisitor = group.teams.find((team) => team.name.slice(0, 3) === inputTeamVisitorInfo[1]);

            // se encontraron los equipos
            if (teamLocal != undefined && teamVisitor != undefined) {
                //4.- Obtener el juego
                const game = group.calendars.find((game) => game.local.slice(0, 3) === inputTeamLocalInfo[1] && game.visitor.slice(0, 3) === inputTeamVisitorInfo[1]);
  

                // se encontro el juego y se actualizan los goles
                if (game != undefined) {
                    if (isInvalid) {
                        game.updateGoals(-1, -1)
                    } else {
                        game.updateGoals(parseInt(inputLocal.value), parseInt(inputVisitor.value));
                        createMessage("Resultado Actualizado Correctamente",1)
                    }

                    // se actualizan los puntos de cada equipo
                    teamLocal.updateValues(group.calendars);
                    teamVisitor.updateValues(group.calendars);

                } else {
                    createMessage("Error del Sistema: No se encontró el juego a relacionar",0)
                }
            } else {
                createMessage("Error del Sistema: No se encontró el equipo a actualizar",0)
            }
        } else {
            createMessage("Error del Sistema: No se encontraron los grupos",0)
        }

        //Ordenar la tabla de equipos
        sortTeams(group.teams);


        // se marcan las filas de los posibles ganadores
        markTeamsClasified(group.teams.slice(0, sim.qtyTeamsClasified), false);
        // se marcan los equipos que no clasifican
        unmarkTeamsClasified(group.teams.slice(sim.qtyTeamsClasified, group.teams.length));

        if (sim.qtyThirdTeamsClasified > 0) {
            getBestThird(sim.groups);
        }


        // Actualizar las tablas de grupos 
        sim.groups.forEach(g => {
            let divStanding = document.getElementById(`div-standing-${g.name}`);
            divStanding.innerHTML = ''
            sim.createTableStanding(divStanding, g);
        })
       

    }

    localStorage.setItem(`${sim.name}`, JSON.stringify(sim));

}

function validateIsValidGoal(value) {
    // Utilizar expresión regular para verificar si es un número entero mayor o igual a cero

    return /^\d+$/.test(value) && parseInt(value, 10) >= 0

}

function sortTeams(teams) {
    // Ordenar los terceros por puntos de mayor a menor
    teams.sort((a, b) => {

        // Criterio 1: Puntos
        if (a.points != b.points) {
            return b.points - a.points;
        }

        // que ya haya jugado partido
        if (a.gamesPlayed != b.gamesPlayed) {
            return b.gamesPlayed - a.gamesPlayed;
        }

        // Criterio 2: Mayor diferencia de goles
        if (a.goalsDifference != b.goalsDifference) {
            return b.goalsDifference - a.goalsDifference;
        }

        return 0;
    });

}

// Función para obtener el mejor tercero según las reglas de la UEFA
function getBestThird(groups) {
    // Obtener todos los equipos terceros y los desmarco (por si estaban marcados por datos anteriores)
    const third = groups.map(group => group.teams[2])
    unmarkTeamsClasified(third)

    // ordenedas los equipos seleccionadoss
    sortTeams(third);

    // Tomar los cuatro mejores terceros
    const bestThird = third.slice(0, sim.qtyThirdTeamsClasified);

    // se marcan los mejores terceros segun qtyThirdTeamsClasified
    markTeamsClasified(bestThird, true);


}

function markTeamsClasified(teamsClasified, isThird) {

    for (const team of teamsClasified) {
        if (team.gamesPlayed > 0) {
            team.clasified = true;
            team.isThird = isThird;
        } else {
            team.clasified = false;
            team.isThird = false;
        }

    }
}

function unmarkTeamsClasified(teamsNotClasified) {
    for (const team of teamsNotClasified) {
        team.clasified = false;
        team.isThird = false;
    }
}

function formatDate (stringDate) {

    moment.locale('es');

    // Formatea la fecha en el formato deseado
    const fechaFormateada = moment(stringDate).format('DD [de] MMMM, HH:mm');
    
    return fechaFormateada;
}

function formatLongDate (stringDate) {

    moment.locale('es');
    // Formatea la fecha en el formato deseado
    const fechaFormateada = moment(stringDate).format('DD [de] MMMM [del] YYYY');
    
    return fechaFormateada;
}

function createMessage (message, type) {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top", // `top` or `bottom`
        position: "right", // `right`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: type==1?'green':'#990F02',
        }
      }).showToast();
}