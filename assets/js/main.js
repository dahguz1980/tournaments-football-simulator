const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
} 

let qty_teams_clasified = 0;
let qty_third_teams_clasified = 0;
let sim; 

class Simulator  {
    constructor (name, groups) {
        this.name = name;
        this.groups = groups;
    }

    createTableGroups () {
        const groupsContainer = document.getElementById("groupsPhase")
        

        this.groups.forEach(element => {
            // create div container for the group
            let div = document.createElement("div");
            div.id=`div-standing-${element.name}`
            div.className = "table-responsive with-responsive"
            const divStanding = this.createTableStanding(div, element);
            // append to the groupsContainer
            groupsContainer.appendChild(divStanding);

            // append games
            element.calendar.forEach (game  => {
                const divGame =    `<div class="simulate-group border-top with-responsive row p-2 text-center">
                                        <div class="col-12 col-xl-3 p-2 p-xl-0">${game.gameDate}</div>
                                        <div class="col-12 col-xl-6 row">
                                            <div class="col-4 text-right"><img src="${game.localFlag}" class="d-none d-sm-inline" width="16px" height="16px">&nbsp;${game.local}</div>
                                            <form class="d-flex justify-content-between col-4">
                                                <input id="${element.name+'_'+game.local}" type="text" class="form-control" value="${game.goalsLocal}" onChange="updateResults(form)"> 
                                                - 
                                                <input id="${element.name+'_'+game.visitor}" type="text" class="form-control" value="${game.goalsVisitor}" onChange="updateResults(form)">
                                            </form>
                                            <div class="col-4 text-left"><img class="d-none d-sm-inline" src="${game.visitorFlag}" width="16px" height="16px">&nbsp;${game.visitor}</div>
                                        </div>
                                        <div class="col-12 col-xl-3 p-2 p-xl-0">${game.gamePlace}</div>
                                    </div>`

                groupsContainer.innerHTML += divGame;

            })
        });

    }

    createTableStanding(div,element) {

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
        
        return div;
    }
}

class Calendar {
    constructor (local, visitor, gameDate, gamePlace) {
        this.local = local.slice(0,3);
        this.localFlag = `../assets/img/${removeAccents(local).replace(/\s+/g, "")}.webp`
        this.visitor = visitor.slice(0,3);
        this.visitorFlag = `../assets/img/${removeAccents(visitor).replace(/\s+/g, "")}.webp`
        this.gameDate = gameDate;
        this.gamePlace = gamePlace;
        this.goalsLocal = "";
        this.goalsVisitor = "";
        this.winner=""
        this.losser=""
        this.draw=""
    }

    updateGoals (goalsLocal, goalsVisitor) {

        if (goalsLocal!=-1 && goalsVisitor!=-1) {

            this.goalsLocal = goalsLocal;
            this.goalsVisitor = goalsVisitor;
                
            if (goalsLocal>goalsVisitor) {
                this.winner = this.local;
                this.losser = this.visitor;
            } else if (goalsLocal<goalsVisitor) {
                this.losser = this.local;
                this.winner = this.visitor;
            } else {
                this.draw = "1"
                this.losser = "";
                this.winner = "";
            }
        } else {
            this.draw = ""
            this.losser = "";
            this.winner = "";
        }
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
        this.points = points;
        this.goalsDifference = goalsFor - goalsAgainst;
        this.clasified = false;
        this.isThird = false;


    }

    updateValues (games) {
        
        let gamesPlayed = 0;
        let wins = 0; 
        let draws = 0;
        let losses = 0;
        let goalsFor = 0;
        let goalsAgainst = 0;
        let points = 0;

        for (const game of games) {

            if ((game.local == this.name.slice(0,3) || game.visitor == this.name.slice(0,3)) && (game.winner!="" || game.losser!="" || game.draw==1)) {
        
                gamesPlayed+=1;

                if (game.winner === this.name.slice(0,3)) {
                    wins++;
                    points+=3;
                    
                } else if (game.winner != "" ) {
                    losses++;
                } else {
                    draws++;
                    points++;
                }

                // Sumar goles dependiendo si el equipo es local o visitante

                if (game.local===this.name.slice(0,3)) {
                    goalsFor += game.goalsLocal;
                    goalsAgainst += game.goalsVisitor;
                } else if (game.visitor===this.name.slice(0,3)) {
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
    constructor(name, teams, calendar){
        this.name = name;
        this.teams = teams;
        this.calendar = calendar;
    }
}

function createCalendar(groupName) {
    let game1, game2, game3, game4, game5,game6, game7, game8,game9,game10 = "";
    let games = []

        switch(groupName) {
            case "A_EURO":   game1 = new Calendar ("Turquía", "Italia", "11 de junio de 2021 21:00", "Estadio Olímpico, Roma");
                        game2 = new Calendar ("Gales","Suiza", "12 de junio de 2021 15:00", "Estadio Olímpico, Bakú");
                        game3 = new Calendar ("Turquía","Gales", "16 de junio de 2021 18:00", "Estadio Olímpico, Bakú");
                        game4 = new Calendar ("Italia", "Suiza", "16 de junio de 2021 21:00", "Estadio Olímpico, Roma");
                        game5 = new Calendar ("Suiza","Turquía", "20 de junio de 2021 18:00", "Estadio Olímpico, Bakú");
                        game6 = new Calendar ("Italia", "Gales", "20 de junio de 2021 18:00", "Estadio Olímpico, Roma");
                        games = [game1,game2,game3,game4,game5,game6]

                        break;

            case "B_EURO":   game1 = new Calendar ("Dinamarca", "Finlandia", "12 de junio de 2021 18:00", "Parken Stadion, Copenhague");
                        game2 = new Calendar ("Bélgica","Rusia", "12 de junio de 2021 21:00", "Estadio Krestovski, San Petersburgo");
                        game3 = new Calendar ("Finlandia","Rusia", "16 de junio de 2021 15:00", "Estadio Krestovski, San Petersburgo");
                        game4 = new Calendar ("Dinamarca", "Bélgica", "17 de junio de 2021 18:00", "Parken Stadion, Copenhague");
                        game5 = new Calendar ("Rusia", "Dinamarca", "21 de junio de 2021 21:00", "Parken Stadion, Copenhague");
                        game6 = new Calendar ("Finlandia","Bélgica", "21 de junio de 2021 21:00", "Estadio Krestovski, San Petersburgo");
                        games = [game1,game2,game3,game4,game5,game6]
            
                        break;
                        
            case "C_EURO":   game1 = new Calendar ("Austria", "Macedonia del Norte", "13 de junio de 2021 18:00", "Arena Națională, Bucarest");
                        game2 = new Calendar ("Países Bajos","Ucrania", "13 de junio de 2021 21:00", "Johan Cruyff Arena, Ámsterdam");
                        game3 = new Calendar ("Ucrania","Macedonia del Norte", "17 de junio de 2021 15:00", "Arena Națională, Bucarest");
                        game4 = new Calendar ("Países Bajos", "Austria", "17 de junio de 2021 21:00", "Johan Cruyff Arena, Ámsterdam");
                        game5 = new Calendar ("Macedonia del Norte","Países Bajos", "21 de junio de 2021 18:00", "Johan Cruyff Arena, Ámsterdam");
                        game6 = new Calendar ("Ucrania", "Austria", "21 de junio de 2021 18:00", "Arena Națională, Bucarest");
                        games = [game1,game2,game3,game4,game5,game6]

                        break;

            case "D_EURO":   game1 = new Calendar ("Inglaterra", "Croacia", "13 de junio de 2021 15:00", "Estadio de Wembley, Londres");
                        game2 = new Calendar ("Escocia","República Checa", "14 de junio de 2021 15:00", "Hampden Park, Glasgow");
                        game3 = new Calendar ("Croacia","República Checa", "18 de junio de 2021 18:00", "Hampden Park, Glasgow");
                        game4 = new Calendar ("Inglaterra", "Escocia", "18 de junio de 2021 21:00", "Estadio de Wembley, Londres");
                        game5 = new Calendar ("Croacia","Escocia", "22 de junio de 2021 21:00", "Hampden Park, Glasgow");
                        game6 = new Calendar ("República Checa", "Inglaterra", "22 de junio de 2021 21:00", "Estadio de Wembley, Londres");
                        games = [game1,game2,game3,game4,game5,game6]

                        break;

            case "E_EURO":   game1 = new Calendar ("Polonia", "Eslovaquia", "14 de junio de 2021 18:00", "Estadio Krestovski, San Petersburgo");
                        game2 = new Calendar ("España","Suecia", "14 de junio de 2021 21:00", "Estadio La Cartuja, Sevilla");
                        game3 = new Calendar ("Suecia","Eslovaquia", "18 de junio de 2021 15:00", "Estadio Krestovski, San Petersburgo");
                        game4 = new Calendar ("España", "Polonia", "19 de junio de 2021 21:00", "Estadio La Cartuja, Sevilla");
                        game5 = new Calendar ("Eslovaquia","España", "23 de junio de 2021 18:00", "Estadio La Cartuja, Sevilla");
                        game6 = new Calendar ("Suecia", "Polonia", "23 de junio de 2021 18:00", "Estadio Krestovski, San Petersburgo");
                        games = [game1,game2,game3,game4,game5,game6]

                        break;

            case "F_EURO":   game1 = new Calendar ("Hungría", "Portugal", "15 de junio de 2021 18:00", "Puskás Aréna, Budapest");
                            game2 = new Calendar ("Francia","Alemania", "15 de junio de 2021 21:00", "Allianz Arena, Múnich");
                            game3 = new Calendar ("Hungría","Francia", "19 de junio de 2021 15:00", "Puskás Aréna, Budapest");
                            game4 = new Calendar ("Portugal", "Alemania", "19 de junio de 2021 18:00", "Allianz Arena, Múnich");
                            game5 = new Calendar ("Portugal","Francia", "23 de junio de 2021 21:00", "Puskás Aréna, Budapest");
                            game6 = new Calendar ("Alemania", "Hungría", "23 de junio de 2021 21:00", "Allianz Arena, Múnich");
                            games = [game1,game2,game3,game4,game5,game6]

                            break;
            case "A_AMERICA":   game1 = new Calendar ("Argentina", "Chile", "14 de junio de 2021 18:00", "Estadio Nilton Santos, Río de Janeiro");
                                game2 = new Calendar ("Paraguay","Bolivia", "14 de junio de 2021 21:00", "Estadio Olímpico, Goiânia");
                                game3 = new Calendar ("Chile","Bolivia", "18 de junio de 2021 17:00", "Arena Pantanal, Cuiabá");
                                game4 = new Calendar ("Argentina", "Uruguay", "18 de junio de 2021 21:00", "Estadio Mané Garrincha, Brasilia");
                                game5 = new Calendar ("Uruguay","Chile", "21 de junio de 2021 17:00", "Arena Pantanal, Cuiabá");
                                game6 = new Calendar ("Argentina", "Paraguay", "21 de junio de 2021 21:00", "Estadio Mané Garrincha, Brasilia");
                                game7 = new Calendar ("Bolivia", "Uruguay", "24 de junio de 2021 17:00", "Arena Pantanal, Cuiabá");
                                game8 = new Calendar ("Chile", "Paraguay", "24 de junio de 2021 21:00", "Estadio Mané Garrincha, Brasilia");
                                game9 = new Calendar ("Bolivia", "Argentina", "28 de junio de 2021 20:00", "Arena Pantanal, Cuiabá");
                                game10 = new Calendar ("Uruguay", "Paraguay", "28 de junio de 2021 21:00", "Estadio Nilton Santos, Río de Janeiro");
                                games = [game1,game2,game3,game4,game5,game6,game7,game8,game9,game10]

                                break;

            case "B_AMERICA":   game1 = new Calendar ("Brasil", "Venezuela", "13 de junio de 2021 18:00", "Estadio Mané Garrincha, Brasilia");
                                game2 = new Calendar ("Colombia","Ecuador", "13 de junio de 2021 20:00", "Arena Pantanal, Cuiabá");
                                game3 = new Calendar ("Colombia","Venezuela", "17 de junio de 2021 18:00", "Estadio Olímpico, Goiânia");
                                game4 = new Calendar ("Brasil", "Perú", "17 de junio de 2021 21:00", "Estadio Nilton Santos, Río de Janeiro");
                                game5 = new Calendar ("Venezuela","Ecuador", "21 de junio de 2021 17:00", "Estadio Nilton Santos, Río de Janeiro");
                                game6 = new Calendar ("Colombia", "Perú", "21 de junio de 2021 21:00", "Estadio Olímpico, Goiânia");
                                game7 = new Calendar ("Ecuador", "Perú", "24 de junio de 2021 17:00", "Estadio Olímpico, Goiânia");
                                game8 = new Calendar ("Brasil", "Colombia", "24 de junio de 2021 21:00", "Estadio Nilton Santos, Río de Janeiro");
                                game9 = new Calendar ("Brasil", "Ecuador", "28 de junio de 2021 20:00", "Estadio Olímpico, Goiânia");
                                game10 = new Calendar ("Venezuela", "Perú", "28 de junio de 2021 21:00", "Estadio Mané Garrincha, Brasilia");
                                games = [game1,game2,game3,game4,game5,game6,game7,game8,game9,game10]

                                break;
            
        }

        
        return games;
    
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
    const GROUP_A = new Group("A",createTeams(["Turquía","Italia","Gales","Suiza"]),createCalendar("A_EURO"));
    const GROUP_B = new Group("B",createTeams(["Bélgica","Dinamarca","Finlandia","Rusia"]),createCalendar("B_EURO"));
    const GROUP_C = new Group("C",createTeams(["Países Bajos","Austria","Ucrania","Macedonia del Norte"]),createCalendar("C_EURO"));
    const GROUP_D = new Group("D",createTeams(["Inglaterra","Croacia","República Checa","Escocia"]),createCalendar("D_EURO"));
    const GROUP_E = new Group("E",createTeams(["Suecia","España","Eslovaquia","Polonia"]),createCalendar("E_EURO"));
    const GROUP_F = new Group("F",createTeams(["Francia","Alemania","Portugal","Hungría"]),createCalendar("F_EURO"));


    return [GROUP_A, GROUP_B, GROUP_C, GROUP_D, GROUP_E, GROUP_F]
}

function createCopaAmericaGroups()  {
    const GROUP_A = new Group("A",createTeams(["Argentina","Uruguay","Paraguay","Chile","Bolivia"]),createCalendar("A_AMERICA"));
    const GROUP_B = new Group("B",createTeams(["Brasil","Perú","Colombia","Ecuador", "Venezuela"]),createCalendar("B_AMERICA"));

    return [GROUP_A, GROUP_B]
}

// SIMULADOR DE EUROCOPA
function initEurocopa() {
    sim = new Simulator("Eurocopa",createEuroGroups());
    qty_teams_clasified = 2;
    qty_third_teams_clasified = 4;
   sim.createTableGroups();
}

// SIMULADOR DE Copa America
function initCopaAmerica() {
    const sim = new Simulator("Copa América",createCopaAmericaGroups());
    qty_teams_clasified = 4;
    qty_third_teams_clasified = 0;
    simulateGroupStage(sim.groups);
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
    let inputLocal = e[0];
    let inputVisitor = e[1];

    // Validar si ambos input ya contienen datos validos
    if (inputLocal!=undefined && inputVisitor!=undefined) {

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
        if (group!=undefined) {
            //3.- Buscar los equipos
            const teamLocal = group.teams.find((team) => team.name.slice(0,3) === inputTeamLocalInfo[1]);
            const teamVisitor = group.teams.find((team) =>  team.name.slice(0,3) === inputTeamVisitorInfo[1]);

            // se encontraron los equipos
            if (teamLocal!=undefined && teamVisitor!= undefined) {
                //4.- Obtener el juego
                const game = group.calendar.find((game) => game.local === inputTeamLocalInfo[1] && game.visitor === inputTeamVisitorInfo[1]);

                // se encontro el juego y se actualizan los goles
                if (game!=undefined) {
                    if (isInvalid) {
                        game.updateGoals(-1,-1)
                    } else {
                        game.updateGoals (parseInt(inputLocal.value),parseInt(inputVisitor.value));
                    }
                    
                    // se actualizan los puntos de cada equipo
                    teamLocal.updateValues(group.calendar);
                    teamVisitor.updateValues(group.calendar);

                    
                } else {
                    alert("Ocurrió un error inesperado")
                }
            } else {
                alert ("Ocurrió un error inesperado")
            } 
        } else {
            alert("Ocurrio un error inesperado")
        }

        //Ordenar la tabla de equipos
        sortTeams(group.teams);

       
        // se marcan las filas de los posibles ganadores
        markTeamsClasified(group.teams.slice(0,qty_teams_clasified), false);

        if (qty_third_teams_clasified > 0) {
            getBestThird(sim.groups);
        }
    

         // Actualizar la tabla de grupos correspondiente
        
        let divStanding = document.getElementById(`div-standing-${group.name}`);
        divStanding.innerHTML = ''
        sim.createTableStanding(divStanding,group);
    }

}

function validateIsValidGoal(value) {
        // Utilizar expresión regular para verificar si es un número entero mayor o igual a cero

        return /^\d+$/.test(value) && parseInt(value, 10) >= 0
       
}

function sortTeams (teams) {
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
    
        // Criterio 2: Mayor cantidad de goles a favor
        if (a.goalsFor != b.goalsFor) {
          return b.goalsFor - a.goalsFor;
        }

        return 0;
      });
  
}

// Función para obtener el mejor tercero según las reglas de la UEFA
function getBestThird(groups) {
    // Obtener todos los equipos terceros
    const third = groups.map(group => group.teams[2]);
  
    // ordenedas los equipos seleccionadoss
   sortTeams(third);

    // Tomar los cuatro mejores terceros
  const bestThird = third.slice(0, qty_third_teams_clasified);
  markTeamsClasified(bestThird, true);


}

function markTeamsClasified (teamsClasified, isThird) {

    for (const team of teamsClasified) {
        if (team.gamesPlayed>0) {
            team.clasified = true;
            team.isThird = isThird;
        } else {
            team.clasified = false;
            team.isThird = false;
        }
        
    }
}