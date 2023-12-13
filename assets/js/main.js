const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

let qty_teams_clasified = 0;
let qty_third_teams_clasified = 0;
let sim;

class Simulator {
    constructor(name, groups) {
        this.name = name;
        this.groups = groups;
    }

    createTableGroups() {
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
            element.calendar.forEach(game => {
                const divGame = `<div class="simulate-group border-top with-responsive row p-2 text-center">
                                        <div class="col-12 col-xl-3 p-2 p-xl-0">${game.gameDate}</div>
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
        h2.innerText = `Grupo ${element.name}`;
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

class Calendar {
    constructor(local, visitor, gameDate, gamePlace, goalsLocal, goalsVisitor, winner, losser, draw) {
        this.local = local;
        this.localFlag = `../assets/img/${removeAccents(local).replace(/\s+/g, "")}.webp`
        this.visitor = visitor;
        this.visitorFlag = `../assets/img/${removeAccents(visitor).replace(/\s+/g, "")}.webp`
        this.gameDate = gameDate;
        this.gamePlace = gamePlace;
        this.goalsLocal = goalsLocal;
        this.goalsVisitor = goalsVisitor;
        this.winner = winner;
        this.losser = losser;
        this.draw = draw;
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
    constructor(name, gamesPlayed, wins, draws, losses, goalsFor, goalsAgainst, points, clasified, isThird) {
        this.name = name;
        this.flag = `../assets/img/${removeAccents(name).toLowerCase().replace(/\s+/g, "")}.webp`;
        this.gamesPlayed = gamesPlayed;
        this.wins = wins;
        this.draws = draws;
        this.losses = losses;
        this.goalsFor = goalsFor;
        this.goalsAgainst = goalsAgainst;
        this.points = points;
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
    constructor(name, teams, calendar) {
        this.name = name;
        this.teams = teams;
        this.calendar = calendar;
    }
}

function createCalendar(calendar) {
    let games = []

    calendar.forEach(c => {
        let game = new Calendar(c.local, c.visitor, c.gameDate, c.gamePlace, c.goalsLocal, c.goalsVisitor, c.winner, c.losser, c.draw);
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
            teamList.push(new Team(team.name, team.gamesPlayed, team.wins, team.draws, team.losses, team.goalsFor, team.goalsAgainst, team.points, team.clasified, team.isThird));
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
            let group = new Group(element.name, createTeams(element.teams), createCalendar(element.calendar))
            groups.push(group);
        });

    }

    return groups;
}

// SIMULADOR DE EUROCOPA
function initEurocopa() {
    sim = localStorage.getItem("sim_Eurocopa_groups") != undefined ? new Simulator("Eurocopa", createGroups(JSON.parse(localStorage.getItem("sim_Eurocopa_groups")))) : new Simulator("Eurocopa", createGroups(data_ini));
    qty_teams_clasified = 2;
    qty_third_teams_clasified = 4;
    sim.createTableGroups();
}

// SIMULADOR DE Copa America
function initCopaAmerica() {
    sim = localStorage.getItem("sim_CopaAmerica_groups") != undefined ? new Simulator("CopaAmerica", createGroups(JSON.parse(localStorage.getItem("sim_CopaAmerica_groups")))) : new Simulator("CopaAmerica", createGroups(data_ini_ca));
    qty_teams_clasified = 4;
    qty_third_teams_clasified = 0;
    sim.createTableGroups();
}


function simulateGroupStage(groups) {

    for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        simulateGroup(group);
    }

    if (qty_third_teams_clasified > 0) {
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
            isInvalid = true;
            //return;
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
                const game = group.calendar.find((game) => game.local.slice(0, 3) === inputTeamLocalInfo[1] && game.visitor.slice(0, 3) === inputTeamVisitorInfo[1]);

                // se encontro el juego y se actualizan los goles
                if (game != undefined) {
                    if (isInvalid) {
                        game.updateGoals(-1, -1)
                    } else {
                        game.updateGoals(parseInt(inputLocal.value), parseInt(inputVisitor.value));
                    }

                    // se actualizan los puntos de cada equipo
                    teamLocal.updateValues(group.calendar);
                    teamVisitor.updateValues(group.calendar);


                } else {
                    alert("Error del Sistema: No se encontró el juego a relacionar")
                }
            } else {
                alert("Error del Sistema: No se encontró el equipo a actualizar")
            }
        } else {
            alert("Error del Sistema: No se entraron los grupos")
        }

        //Ordenar la tabla de equipos
        sortTeams(group.teams);


        // se marcan las filas de los posibles ganadores
        markTeamsClasified(group.teams.slice(0, qty_teams_clasified), false);
        // se marcan los equipos que no clasifican
        unmarkTeamsClasified(group.teams.slice(qty_teams_clasified, group.teams.length));

        if (qty_third_teams_clasified > 0) {
            getBestThird(sim.groups);
        }


        // Actualizar la tabla de grupos correspondiente

        let divStanding = document.getElementById(`div-standing-${group.name}`);
        divStanding.innerHTML = ''
        sim.createTableStanding(divStanding, group);

    }

    localStorage.setItem(`sim_${sim.name}_groups`, JSON.stringify(sim.groups));

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
    // Obtener todos los equipos terceros
    const third = groups.map(group => group.teams[2])

    // ordenedas los equipos seleccionadoss
    sortTeams(third);

    // Tomar los cuatro mejores terceros
    const bestThird = third.slice(0, qty_third_teams_clasified);
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

const data_ini =
    [
        {
            "name": "A",
            "teams": [
                {
                    "name": "Italia",
                    "flag": "../assets/img/italia.webp",
                    "gamesPlayed": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "goalsFor": 0,
                    "goalsAgainst": 0,
                    "points": 0,
                    "goalsDifference": 0,
                    "clasified": false,
                    "isThird": false
                },
                {
                    "name": "Turquía",
                    "flag": "../assets/img/turquia.webp",
                    "gamesPlayed": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "goalsFor": 0,
                    "goalsAgainst": 0,
                    "points": 0,
                    "goalsDifference": 0,
                    "clasified": false,
                    "isThird": false
                },
                {
                    "name": "Gales",
                    "flag": "../assets/img/gales.webp",
                    "gamesPlayed": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "goalsFor": 0,
                    "goalsAgainst": 0,
                    "points": 0,
                    "goalsDifference": 0,
                    "clasified": false,
                    "isThird": false
                },
                {
                    "name": "Suiza",
                    "flag": "../assets/img/suiza.webp",
                    "gamesPlayed": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "goalsFor": 0,
                    "goalsAgainst": 0,
                    "points": 0,
                    "goalsDifference": 0,
                    "clasified": false,
                    "isThird": false
                }
            ],
            "calendar": [
                {
                    "local": "Turquía",
                    "localFlag": "../assets/img/Turquia.webp",
                    "visitor": "Italia",
                    "visitorFlag": "../assets/img/Italia.webp",
                    "gameDate": "11 de junio de 2021 21:00",
                    "gamePlace": "Estadio Olímpico, Roma",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "Gales",
                    "localFlag": "../assets/img/Gales.webp",
                    "visitor": "Suiza",
                    "visitorFlag": "../assets/img/Suiza.webp",
                    "gameDate": "12 de junio de 2021 15:00",
                    "gamePlace": "Estadio Olímpico, Bakú",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "Turquía",
                    "localFlag": "../assets/img/Turquia.webp",
                    "visitor": "Gales",
                    "visitorFlag": "../assets/img/Gales.webp",
                    "gameDate": "16 de junio de 2021 18:00",
                    "gamePlace": "Estadio Olímpico, Bakú",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "Italia",
                    "localFlag": "../assets/img/Italia.webp",
                    "visitor": "Suiza",
                    "visitorFlag": "../assets/img/Suiza.webp",
                    "gameDate": "16 de junio de 2021 21:00",
                    "gamePlace": "Estadio Olímpico, Roma",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "Suiza",
                    "localFlag": "../assets/img/Suiza.webp",
                    "visitor": "Turquía",
                    "visitorFlag": "../assets/img/Turquia.webp",
                    "gameDate": "20 de junio de 2021 18:00",
                    "gamePlace": "Estadio Olímpico, Bakú",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "Italia",
                    "localFlag": "../assets/img/Italia.webp",
                    "visitor": "Gales",
                    "visitorFlag": "../assets/img/Gales.webp",
                    "gameDate": "20 de junio de 2021 18:00",
                    "gamePlace": "Estadio Olímpico, Roma",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                }
            ]
        },
        {
            "name": "B",
            "teams": [
                {
                    "name": "Bélgica",
                    "flag": "../assets/img/belgica.webp",
                    "gamesPlayed": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "goalsFor": 0,
                    "goalsAgainst": 0,
                    "points": 0,
                    "goalsDifference": 0,
                    "clasified": false,
                    "isThird": false
                },
                {
                    "name": "Dinamarca",
                    "flag": "../assets/img/dinamarca.webp",
                    "gamesPlayed": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "goalsFor": 0,
                    "goalsAgainst": 0,
                    "points": 0,
                    "goalsDifference": 0,
                    "clasified": false,
                    "isThird": false
                },
                {
                    "name": "Finlandia",
                    "flag": "../assets/img/finlandia.webp",
                    "gamesPlayed": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "goalsFor": 0,
                    "goalsAgainst": 0,
                    "points": 0,
                    "goalsDifference": 0,
                    "clasified": false,
                    "isThird": false
                },
                {
                    "name": "Rusia",
                    "flag": "../assets/img/rusia.webp",
                    "gamesPlayed": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "goalsFor": 0,
                    "goalsAgainst": 0,
                    "points": 0,
                    "goalsDifference": 0,
                    "clasified": false,
                    "isThird": false
                }
            ],
            "calendar": [
                {
                    "local": "Dinamarca",
                    "localFlag": "../assets/img/Dinamarca.webp",
                    "visitor": "Finlandia",
                    "visitorFlag": "../assets/img/Finlandia.webp",
                    "gameDate": "12 de junio de 2021 18:00",
                    "gamePlace": "Parken Stadion, Copenhague",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "Bélgica",
                    "localFlag": "../assets/img/Belgica.webp",
                    "visitor": "Rusia",
                    "visitorFlag": "../assets/img/Rusia.webp",
                    "gameDate": "12 de junio de 2021 21:00",
                    "gamePlace": "Estadio Krestovski, San Petersburgo",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "Finlandia",
                    "localFlag": "../assets/img/Finlandia.webp",
                    "visitor": "Rusia",
                    "visitorFlag": "../assets/img/Rusia.webp",
                    "gameDate": "16 de junio de 2021 15:00",
                    "gamePlace": "Estadio Krestovski, San Petersburgo",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "Dinamarca",
                    "localFlag": "../assets/img/Dinamarca.webp",
                    "visitor": "Bélgica",
                    "visitorFlag": "../assets/img/Belgica.webp",
                    "gameDate": "17 de junio de 2021 18:00",
                    "gamePlace": "Parken Stadion, Copenhague",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "Rusia",
                    "localFlag": "../assets/img/Rusia.webp",
                    "visitor": "Dinamarca",
                    "visitorFlag": "../assets/img/Dinamarca.webp",
                    "gameDate": "21 de junio de 2021 21:00",
                    "gamePlace": "Parken Stadion, Copenhague",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "Finlandia",
                    "localFlag": "../assets/img/Finlandia.webp",
                    "visitor": "Bélgica",
                    "visitorFlag": "../assets/img/Belgica.webp",
                    "gameDate": "21 de junio de 2021 21:00",
                    "gamePlace": "Estadio Krestovski, San Petersburgo",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                }
            ]
        },
        {
            "name": "C",
            "teams": [
                {
                    "name": "Países Bajos",
                    "flag": "../assets/img/paisesbajos.webp",
                    "gamesPlayed": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "goalsFor": 0,
                    "goalsAgainst": 0,
                    "points": 0,
                    "goalsDifference": 0,
                    "clasified": false,
                    "isThird": false
                },
                {
                    "name": "Austria",
                    "flag": "../assets/img/austria.webp",
                    "gamesPlayed": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "goalsFor": 0,
                    "goalsAgainst": 0,
                    "points": 0,
                    "goalsDifference": 0,
                    "clasified": false,
                    "isThird": false
                },
                {
                    "name": "Ucrania",
                    "flag": "../assets/img/ucrania.webp",
                    "gamesPlayed": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "goalsFor": 0,
                    "goalsAgainst": 0,
                    "points": 0,
                    "goalsDifference": 0,
                    "clasified": false,
                    "isThird": false
                },
                {
                    "name": "Macedonia del Norte",
                    "flag": "../assets/img/macedoniadelnorte.webp",
                    "gamesPlayed": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "goalsFor": 0,
                    "goalsAgainst": 0,
                    "points": 0,
                    "goalsDifference": 0,
                    "clasified": false,
                    "isThird": false
                }
            ],
            "calendar": [
                {
                    "local": "Austria",
                    "localFlag": "../assets/img/Austria.webp",
                    "visitor": "Macedonia del Norte",
                    "visitorFlag": "../assets/img/MacedoniadelNorte.webp",
                    "gameDate": "13 de junio de 2021 18:00",
                    "gamePlace": "Arena Națională, Bucarest",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "Países Bajos",
                    "localFlag": "../assets/img/PaisesBajos.webp",
                    "visitor": "Ucrania",
                    "visitorFlag": "../assets/img/Ucrania.webp",
                    "gameDate": "13 de junio de 2021 21:00",
                    "gamePlace": "Johan Cruyff Arena, Ámsterdam",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "Ucrania",
                    "localFlag": "../assets/img/Ucrania.webp",
                    "visitor": "Macedonia del Norte",
                    "visitorFlag": "../assets/img/MacedoniadelNorte.webp",
                    "gameDate": "17 de junio de 2021 15:00",
                    "gamePlace": "Arena Națională, Bucarest",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "Países Bajos",
                    "localFlag": "../assets/img/PaisesBajos.webp",
                    "visitor": "Austria",
                    "visitorFlag": "../assets/img/Austria.webp",
                    "gameDate": "17 de junio de 2021 21:00",
                    "gamePlace": "Johan Cruyff Arena, Ámsterdam",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "Macedonia del Norte",
                    "localFlag": "../assets/img/MacedoniadelNorte.webp",
                    "visitor": "Países Bajos",
                    "visitorFlag": "../assets/img/PaisesBajos.webp",
                    "gameDate": "21 de junio de 2021 18:00",
                    "gamePlace": "Johan Cruyff Arena, Ámsterdam",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "Ucrania",
                    "localFlag": "../assets/img/Ucrania.webp",
                    "visitor": "Austria",
                    "visitorFlag": "../assets/img/Austria.webp",
                    "gameDate": "21 de junio de 2021 18:00",
                    "gamePlace": "Arena Națională, Bucarest",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                }
            ]
        },
        {
            "name": "D",
            "teams": [
                {
                    "name": "Inglaterra",
                    "flag": "../assets/img/inglaterra.webp",
                    "gamesPlayed": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "goalsFor": 0,
                    "goalsAgainst": 0,
                    "points": 0,
                    "goalsDifference": 0,
                    "clasified": false,
                    "isThird": false
                },
                {
                    "name": "Croacia",
                    "flag": "../assets/img/croacia.webp",
                    "gamesPlayed": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "goalsFor": 0,
                    "goalsAgainst": 0,
                    "points": 0,
                    "goalsDifference": 0,
                    "clasified": false,
                    "isThird": false
                },
                {
                    "name": "República Checa",
                    "flag": "../assets/img/republicacheca.webp",
                    "gamesPlayed": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "goalsFor": 0,
                    "goalsAgainst": 0,
                    "points": 0,
                    "goalsDifference": 0,
                    "clasified": false,
                    "isThird": false
                },
                {
                    "name": "Escocia",
                    "flag": "../assets/img/escocia.webp",
                    "gamesPlayed": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "goalsFor": 0,
                    "goalsAgainst": 0,
                    "points": 0,
                    "goalsDifference": 0,
                    "clasified": false,
                    "isThird": false
                }
            ],
            "calendar": [
                {
                    "local": "Inglaterra",
                    "localFlag": "../assets/img/Inglaterra.webp",
                    "visitor": "Croacia",
                    "visitorFlag": "../assets/img/Croacia.webp",
                    "gameDate": "13 de junio de 2021 15:00",
                    "gamePlace": "Estadio de Wembley, Londres",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "Escocia",
                    "localFlag": "../assets/img/Escocia.webp",
                    "visitor": "República Checa",
                    "visitorFlag": "../assets/img/RepublicaCheca.webp",
                    "gameDate": "14 de junio de 2021 15:00",
                    "gamePlace": "Hampden Park, Glasgow",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "Croacia",
                    "localFlag": "../assets/img/Croacia.webp",
                    "visitor": "República Checa",
                    "visitorFlag": "../assets/img/RepublicaCheca.webp",
                    "gameDate": "18 de junio de 2021 18:00",
                    "gamePlace": "Hampden Park, Glasgow",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "Inglaterra",
                    "localFlag": "../assets/img/Inglaterra.webp",
                    "visitor": "Escocia",
                    "visitorFlag": "../assets/img/Escocia.webp",
                    "gameDate": "18 de junio de 2021 21:00",
                    "gamePlace": "Estadio de Wembley, Londres",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "Croacia",
                    "localFlag": "../assets/img/Croacia.webp",
                    "visitor": "Escocia",
                    "visitorFlag": "../assets/img/Escocia.webp",
                    "gameDate": "22 de junio de 2021 21:00",
                    "gamePlace": "Hampden Park, Glasgow",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "República Checa",
                    "localFlag": "../assets/img/RepublicaCheca.webp",
                    "visitor": "Inglaterra",
                    "visitorFlag": "../assets/img/Inglaterra.webp",
                    "gameDate": "22 de junio de 2021 21:00",
                    "gamePlace": "Estadio de Wembley, Londres",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                }
            ]
        },
        {
            "name": "E",
            "teams": [
                {
                    "name": "Suecia",
                    "flag": "../assets/img/suecia.webp",
                    "gamesPlayed": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "goalsFor": 0,
                    "goalsAgainst": 0,
                    "points": 0,
                    "goalsDifference": 0,
                    "clasified": false,
                    "isThird": false
                },
                {
                    "name": "España",
                    "flag": "../assets/img/espana.webp",
                    "gamesPlayed": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "goalsFor": 0,
                    "goalsAgainst": 0,
                    "points": 0,
                    "goalsDifference": 0,
                    "clasified": false,
                    "isThird": false
                },
                {
                    "name": "Eslovaquia",
                    "flag": "../assets/img/eslovaquia.webp",
                    "gamesPlayed": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "goalsFor": 0,
                    "goalsAgainst": 0,
                    "points": 0,
                    "goalsDifference": 0,
                    "clasified": false,
                    "isThird": false
                },
                {
                    "name": "Polonia",
                    "flag": "../assets/img/polonia.webp",
                    "gamesPlayed": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "goalsFor": 0,
                    "goalsAgainst": 0,
                    "points": 0,
                    "goalsDifference": 0,
                    "clasified": false,
                    "isThird": false
                }
            ],
            "calendar": [
                {
                    "local": "Polonia",
                    "localFlag": "../assets/img/Polonia.webp",
                    "visitor": "Eslovaquia",
                    "visitorFlag": "../assets/img/Eslovaquia.webp",
                    "gameDate": "14 de junio de 2021 18:00",
                    "gamePlace": "Estadio Krestovski, San Petersburgo",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "España",
                    "localFlag": "../assets/img/Espana.webp",
                    "visitor": "Suecia",
                    "visitorFlag": "../assets/img/Suecia.webp",
                    "gameDate": "14 de junio de 2021 21:00",
                    "gamePlace": "Estadio La Cartuja, Sevilla",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "Suecia",
                    "localFlag": "../assets/img/Suecia.webp",
                    "visitor": "Eslovaquia",
                    "visitorFlag": "../assets/img/Eslovaquia.webp",
                    "gameDate": "18 de junio de 2021 15:00",
                    "gamePlace": "Estadio Krestovski, San Petersburgo",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "España",
                    "localFlag": "../assets/img/Espana.webp",
                    "visitor": "Polonia",
                    "visitorFlag": "../assets/img/Polonia.webp",
                    "gameDate": "19 de junio de 2021 21:00",
                    "gamePlace": "Estadio La Cartuja, Sevilla",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "Eslovaquia",
                    "localFlag": "../assets/img/Eslovaquia.webp",
                    "visitor": "España",
                    "visitorFlag": "../assets/img/Espana.webp",
                    "gameDate": "23 de junio de 2021 18:00",
                    "gamePlace": "Estadio La Cartuja, Sevilla",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "Suecia",
                    "localFlag": "../assets/img/Suecia.webp",
                    "visitor": "Polonia",
                    "visitorFlag": "../assets/img/Polonia.webp",
                    "gameDate": "23 de junio de 2021 18:00",
                    "gamePlace": "Estadio Krestovski, San Petersburgo",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                }
            ]
        },
        {
            "name": "F",
            "teams": [
                {
                    "name": "Francia",
                    "flag": "../assets/img/francia.webp",
                    "gamesPlayed": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "goalsFor": 0,
                    "goalsAgainst": 0,
                    "points": 0,
                    "goalsDifference": 0,
                    "clasified": false,
                    "isThird": false
                },
                {
                    "name": "Alemania",
                    "flag": "../assets/img/alemania.webp",
                    "gamesPlayed": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "goalsFor": 0,
                    "goalsAgainst": 0,
                    "points": 0,
                    "goalsDifference": 0,
                    "clasified": false,
                    "isThird": false
                },
                {
                    "name": "Portugal",
                    "flag": "../assets/img/portugal.webp",
                    "gamesPlayed": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "goalsFor": 0,
                    "goalsAgainst": 0,
                    "points": 0,
                    "goalsDifference": 0,
                    "clasified": false,
                    "isThird": false
                },
                {
                    "name": "Hungría",
                    "flag": "../assets/img/hungria.webp",
                    "gamesPlayed": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "goalsFor": 0,
                    "goalsAgainst": 0,
                    "points": 0,
                    "goalsDifference": 0,
                    "clasified": false,
                    "isThird": false
                }
            ],
            "calendar": [
                {
                    "local": "Hungría",
                    "localFlag": "../assets/img/Hungria.webp",
                    "visitor": "Portugal",
                    "visitorFlag": "../assets/img/Portugal.webp",
                    "gameDate": "15 de junio de 2021 18:00",
                    "gamePlace": "Puskás Aréna, Budapest",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "Francia",
                    "localFlag": "../assets/img/Francia.webp",
                    "visitor": "Alemania",
                    "visitorFlag": "../assets/img/Alemania.webp",
                    "gameDate": "15 de junio de 2021 21:00",
                    "gamePlace": "Allianz Arena, Múnich",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "Hungría",
                    "localFlag": "../assets/img/Hungria.webp",
                    "visitor": "Francia",
                    "visitorFlag": "../assets/img/Francia.webp",
                    "gameDate": "19 de junio de 2021 15:00",
                    "gamePlace": "Puskás Aréna, Budapest",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "Portugal",
                    "localFlag": "../assets/img/Portugal.webp",
                    "visitor": "Alemania",
                    "visitorFlag": "../assets/img/Alemania.webp",
                    "gameDate": "19 de junio de 2021 18:00",
                    "gamePlace": "Allianz Arena, Múnich",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "Portugal",
                    "localFlag": "../assets/img/Portugal.webp",
                    "visitor": "Francia",
                    "visitorFlag": "../assets/img/Francia.webp",
                    "gameDate": "23 de junio de 2021 21:00",
                    "gamePlace": "Puskás Aréna, Budapest",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                },
                {
                    "local": "Alemania",
                    "localFlag": "../assets/img/Alemania.webp",
                    "visitor": "Hungría",
                    "visitorFlag": "../assets/img/Hungria.webp",
                    "gameDate": "23 de junio de 2021 21:00",
                    "gamePlace": "Allianz Arena, Múnich",
                    "goalsLocal": "",
                    "goalsVisitor": "",
                    "winner": "",
                    "losser": "",
                    "draw": ""
                }
            ]
        }
    ]


const data_ini_ca = 
[
    {
        "name": "A",
        "teams": [
            {
                "name": "Argentina",
                "flag": "../assets/img/argentina.webp",
                "gamesPlayed": 0,
                "wins": 0,
                "draws": 0,
                "losses": 0,
                "goalsFor": 0,
                "goalsAgainst": 0,
                "points": 0,
                "goalsDifference": 0,
                "clasified": false,
                "isThird": false
            },
            {
                "name": "Uruguay",
                "flag": "../assets/img/uruguay.webp",
                "gamesPlayed": 0,
                "wins": 0,
                "draws": 0,
                "losses": 0,
                "goalsFor": 0,
                "goalsAgainst": 0,
                "points": 0,
                "goalsDifference": 0,
                "clasified": false,
                "isThird": false
            },
            {
                "name": "Paraguay",
                "flag": "../assets/img/paraguay.webp",
                "gamesPlayed": 0,
                "wins": 0,
                "draws": 0,
                "losses": 0,
                "goalsFor": 0,
                "goalsAgainst": 0,
                "points": 0,
                "goalsDifference": 0,
                "clasified": false,
                "isThird": false
            },
            {
                "name": "Chile",
                "flag": "../assets/img/chile.webp",
                "gamesPlayed": 0,
                "wins": 0,
                "draws": 0,
                "losses": 0,
                "goalsFor": 0,
                "goalsAgainst": 0,
                "points": 0,
                "goalsDifference": 0,
                "clasified": false,
                "isThird": false
            },
            {
                "name": "Bolivia",
                "flag": "../assets/img/bolivia.webp",
                "gamesPlayed": 0,
                "wins": 0,
                "draws": 0,
                "losses": 0,
                "goalsFor": 0,
                "goalsAgainst": 0,
                "points": 0,
                "goalsDifference": 0,
                "clasified": false,
                "isThird": false
            }
        ],
        "calendar": [
            {
                "local": "Argentina",
                "localFlag": "../assets/img/argentina.webp",
                "visitor": "Chile",
                "visitorFlag": "../assets/img/chile.webp",
                "gameDate": "14 de junio de 2021 18:00",
                "gamePlace": "Estadio Nilton Santos, Río de Janeiro",
                "goalsLocal": "",
                "goalsVisitor": "",
                "winner": "",
                "losser": "",
                "draw": ""
            },
            {
                "local": "Paraguay",
                "localFlag": "../assets/img/paraguay.webp",
                "visitor": "Bolivia",
                "visitorFlag": "../assets/img/bolivia.webp",
                "gameDate": "14 de junio de 2021 21:00",
                "gamePlace": "Estadio Olímpico, Goiânia",
                "goalsLocal": "",
                "goalsVisitor": "",
                "winner": "",
                "losser": "",
                "draw": ""
            },
            {
                "local": "Chile",
                "localFlag": "../assets/img/chile.webp",
                "visitor": "Bolivia",
                "visitorFlag": "../assets/img/bolivia.webp",
                "gameDate": "18 de junio de 2021 17:00",
                "gamePlace": "Arena Pantanal, Cuiabá",
                "goalsLocal": "",
                "goalsVisitor": "",
                "winner": "",
                "losser": "",
                "draw": ""
            },
            {
                "local": "Argentina",
                "localFlag": "../assets/img/argentina.webp",
                "visitor": "Uruguay",
                "visitorFlag": "../assets/img/uruguay.webp",
                "gameDate": "18 de junio de 2021 21:00",
                "gamePlace": "Estadio Mané Garrincha, Brasilia",
                "goalsLocal": "",
                "goalsVisitor": "",
                "winner": "",
                "losser": "",
                "draw": ""
            },
            {
                "local": "Uruguay",
                "localFlag": "../assets/img/uruguay.webp",
                "visitor": "Chile",
                "visitorFlag": "../assets/img/chile.webp",
                "gameDate": "21 de junio de 2021 17:00",
                "gamePlace": "Arena Pantanal, Cuiabá",
                "goalsLocal": "",
                "goalsVisitor": "",
                "winner": "",
                "losser": "",
                "draw": ""
            },
            {
                "local": "Argentina",
                "localFlag": "../assets/img/argentina.webp",
                "visitor": "Paraguay",
                "visitorFlag": "../assets/img/paraguay.webp",
                "gameDate": "21 de junio de 2021 21:00",
                "gamePlace": "Estadio Mané Garrincha, Brasilia",
                "goalsLocal": "",
                "goalsVisitor": "",
                "winner": "",
                "losser": "",
                "draw": ""
            },
            {
                "local": "Bolivia",
                "localFlag": "../assets/img/bolivia.webp",
                "visitor": "Uruguay",
                "visitorFlag": "../assets/img/uruguay.webp",
                "gameDate": "24 de junio de 2021 17:00",
                "gamePlace": "Arena Pantanal, Cuiabá",
                "goalsLocal": "",
                "goalsVisitor": "",
                "winner": "",
                "losser": "",
                "draw": ""
            },
            {
                "local": "Chile",
                "localFlag": "../assets/img/chile.webp",
                "visitor": "Paraguay",
                "visitorFlag": "../assets/img/paraguay.webp",
                "gameDate": "24 de junio de 2021 21:00",
                "gamePlace": "Estadio Mané Garrincha, Brasilia",
                "goalsLocal": "",
                "goalsVisitor": "",
                "winner": "",
                "losser": "",
                "draw": ""
            },
            {
                "local": "Bolivia",
                "localFlag": "../assets/img/bolivia.webp",
                "visitor": "Argentina",
                "visitorFlag": "../assets/img/argentina.webp",
                "gameDate": "28 de junio de 2021 20:00",
                "gamePlace": "Arena Pantanal, Cuiabá",
                "goalsLocal": "",
                "goalsVisitor": "",
                "winner": "",
                "losser": "",
                "draw": ""
            },
            {
                "local": "Uruguay",
                "localFlag": "../assets/img/uruguay.webp",
                "visitor": "Paraguay",
                "visitorFlag": "../assets/img/paraguay.webp",
                "gameDate": "28 de junio de 2021 21:00",
                "gamePlace": "Estadio Nilton Santos, Río de Janeiro",
                "goalsLocal": "",
                "goalsVisitor": "",
                "winner": "",
                "losser": "",
                "draw": ""
            }
        ]
    },
    {
        "name": "B",
        "teams": [
            {
                "name": "Brasil",
                "flag": "../assets/img/brasil.webp",
                "gamesPlayed": 0,
                "wins": 0,
                "draws": 0,
                "losses": 0,
                "goalsFor": 0,
                "goalsAgainst": 0,
                "points": 0,
                "goalsDifference": 0,
                "clasified": false,
                "isThird": false
            },
            {
                "name": "Perú",
                "flag": "../assets/img/peru.webp",
                "gamesPlayed": 0,
                "wins": 0,
                "draws": 0,
                "losses": 0,
                "goalsFor": 0,
                "goalsAgainst": 0,
                "points": 0,
                "goalsDifference": 0,
                "clasified": false,
                "isThird": false
            },
            {
                "name": "Colombia",
                "flag": "../assets/img/colombia.webp",
                "gamesPlayed": 0,
                "wins": 0,
                "draws": 0,
                "losses": 0,
                "goalsFor": 0,
                "goalsAgainst": 0,
                "points": 0,
                "goalsDifference": 0,
                "clasified": false,
                "isThird": false
            },
            {
                "name": "Ecuador",
                "flag": "../assets/img/ecuador.webp",
                "gamesPlayed": 0,
                "wins": 0,
                "draws": 0,
                "losses": 0,
                "goalsFor": 0,
                "goalsAgainst": 0,
                "points": 0,
                "goalsDifference": 0,
                "clasified": false,
                "isThird": false
            },
            {
                "name": "Venezuela",
                "flag": "../assets/img/venezuela.webp",
                "gamesPlayed": 0,
                "wins": 0,
                "draws": 0,
                "losses": 0,
                "goalsFor": 0,
                "goalsAgainst": 0,
                "points": 0,
                "goalsDifference": 0,
                "clasified": false,
                "isThird": false
            }
        ],
        "calendar": [
            {
                "local": "Brasil",
                "localFlag": "../assets/img/brasil.webp",
                "visitor": "Venezuela",
                "visitorFlag": "../assets/img/veenzuela.webp",
                "gameDate": "13 de junio de 2021 18:00",
                "gamePlace": "Estadio Mané Garrincha, Brasilia",
                "goalsLocal": "",
                "goalsVisitor": "",
                "winner": "",
                "losser": "",
                "draw": ""
            },
            {
                "local": "Colombia",
                "localFlag": "../assets/img/colombia.webp",
                "visitor": "Ecuador",
                "visitorFlag": "../assets/img/ecuador.webp",
                "gameDate": "13 de junio de 2021 20:00",
                "gamePlace": "Arena Pantanal, Cuiabá",
                "goalsLocal": "",
                "goalsVisitor": "",
                "winner": "",
                "losser": "",
                "draw": ""
            },
            {
                "local": "Colombia",
                "localFlag": "../assets/img/colombia.webp",
                "visitor": "Venezuela",
                "visitorFlag": "../assets/img/venezuela.webp",
                "gameDate": "17 de junio de 2021 18:00",
                "gamePlace": "	Estadio Olímpico, Goiânia",
                "goalsLocal": "",
                "goalsVisitor": "",
                "winner": "",
                "losser": "",
                "draw": ""
            },
            {
                "local": "Brasil",
                "localFlag": "../assets/img/brasil.webp",
                "visitor": "Perú",
                "visitorFlag": "../assets/img/peru.webp",
                "gameDate": "17 de junio de 2021 18:00",
                "gamePlace": "Estadio Nilton Santos, Río de Janeiro",
                "goalsLocal": "",
                "goalsVisitor": "",
                "winner": "",
                "losser": "",
                "draw": ""
            },
            {
                "local": "Venezuela",
                "localFlag": "../assets/img/venezuela.webp",
                "visitor": "Ecuador",
                "visitorFlag": "../assets/img/ecuador.webp",
                "gameDate": "20 de junio de 2021 18:00",
                "gamePlace": "Estadio Nilton Santos, Río de Janeiro",
                "goalsLocal": "",
                "goalsVisitor": "",
                "winner": "",
                "losser": "",
                "draw": ""
            },
            {
                "local": "Colombia",
                "localFlag": "../assets/img/colombia.webp",
                "visitor": "Perú",
                "visitorFlag": "../assets/img/peru.webp",
                "gameDate": "20 de junio de 2021 21:00",
                "gamePlace": "Estadio Olímpico, Goiânia",
                "goalsLocal": "",
                "goalsVisitor": "",
                "winner": "",
                "losser": "",
                "draw": ""
            },
            {
                "local": "Ecuador",
                "localFlag": "../assets/img/ecuador.webp",
                "visitor": "Perú",
                "visitorFlag": "../assets/img/peru.webp",
                "gameDate": "23 de junio de 2021 18:00",
                "gamePlace": "Estadio Olímpico, Goiânia",
                "goalsLocal": "",
                "goalsVisitor": "",
                "winner": "",
                "losser": "",
                "draw": ""
            },
            {
                "local": "Brasil",
                "localFlag": "../assets/img/brasil.webp",
                "visitor": "Colombia",
                "visitorFlag": "../assets/img/colombia.webp",
                "gameDate": "23 de junio de 2021 21:00",
                "gamePlace": "Estadio Nilton Santos, Río de Janeiro",
                "goalsLocal": "",
                "goalsVisitor": "",
                "winner": "",
                "losser": "",
                "draw": ""
            },
            {
                "local": "Brasil",
                "localFlag": "../assets/img/brasil.webp",
                "visitor": "Ecuador",
                "visitorFlag": "../assets/img/ecuador.webp",
                "gameDate": "27 de junio de 2021 18:00",
                "gamePlace": "	Estadio Olímpico, Goiânia",
                "goalsLocal": "",
                "goalsVisitor": "",
                "winner": "",
                "losser": "",
                "draw": ""
            },
            {
                "local": "Venezuela",
                "localFlag": "../assets/img/venezuela.webp",
                "visitor": "Perú",
                "visitorFlag": "../assets/img/peru.webp",
                "gameDate": "27 de junio de 2021 18:00",
                "gamePlace": "Estadio Mané Garrincha, Brasilia",
                "goalsLocal": "",
                "goalsVisitor": "",
                "winner": "",
                "losser": "",
                "draw": ""
            }
        ]
    }
]