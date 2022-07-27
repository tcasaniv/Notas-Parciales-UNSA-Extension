// Añade la nota que se debe sacar para aprobar el curso en la propiedad "nota_faltante" de cada asignatura del array de notas
var notas_faltantes = ()=>{
    let nota_aprobatoria = parseFloat(document.querySelector('#nota-aprobatoria').innerText);

    for (let asignatura of notas) {
        let notaXpeso = 0;
        let peso_faltante = 100;
        
        for (let i = 0; i < asignatura.notas.length; i++) {
            peso_faltante -= parseInt(asignatura.pesos[i]);
            
            notaXpeso += parseInt(asignatura.notas[i]) * parseInt(asignatura.pesos[i])/100;
        }

        asignatura.promedioAcumulado = notaXpeso;
        asignatura.faltante_peso = `${peso_faltante}%`;
        asignatura.faltante_nota = peso_faltante?(nota_aprobatoria-notaXpeso)*100/peso_faltante:(nota_aprobatoria-notaXpeso)*1;
        asignatura.faltante_nota_redondeada =Math.ceil(asignatura.faltante_nota);

    }
}


var obtenerNotas = ()=>{
    let notas = [];
    let i=0;
    let filas = document.querySelectorAll("#resul_tab > tbody > tr");

    for (let fila of filas) {
        let condicion = Boolean(fila.childNodes[4])?
            !Boolean(fila.childNodes[2].innerText=='Asignatura'):
            false;
    
        if (condicion) {

            notas[i]?
                '':
                notas[i] = {
                    asignatura: '',
                    grupo: '',
                    parcial: [],
                    notas: [],
                    pesos: []
                };
        
            notas[i].asignatura = fila.childNodes[1].innerText;
            notas[i].grupo = fila.childNodes[3].innerText;
            notas[i].parcial.push(fila.childNodes[2].innerText);
            notas[i].notas.push(fila.childNodes[4].innerText);
            notas[i].pesos.push(fila.childNodes[5].innerText);
            fila.childNodes[2].setAttribute('contenteditable','true');
            fila.childNodes[4].setAttribute('contenteditable','true');
            fila.childNodes[5].setAttribute('contenteditable','true');
        
        } else {
            if(!notas[i]){continue;}
            else {i++;continue;}
        }
    
    
    }
    return notas;
};


// Añade al DOM las notas
var addNota = (mensaje="Nota acumulada",selectorPropiedad="promedioAcumulado",change=false,lugar) => {
    let filas = document.querySelectorAll("#resul_tab > tbody > tr");

    if (!change) {
        let th = document.createElement('th');
        filas[0].appendChild(th);
        th.innerText=`${mensaje}`;
    }
    
    let i=0;
    let otra_asignatura = true;
        
    for (let fila of filas) {
    
        let condicion = Boolean(fila.childNodes[4])?
            !Boolean(fila.childNodes[2].innerText=='Asignatura'):
            false;
        
        //Comprueba si es una fila de asignatura
        if (condicion){

            if (otra_asignatura){

                let contenido = `${notas[i][selectorPropiedad]}`.slice(0,5);

                if (selectorPropiedad=='faltante_nota' || selectorPropiedad == 'faltante_nota_redondeada'){
                    if (parseFloat(contenido)<=0) {
                        contenido = 'Aprobado\n\nSolo evita el abandono'
                    } else if (parseFloat(contenido)<=5) {
                        contenido = `${contenido}\n\nPrácticamente aprobado`;
                    } else if (parseFloat(contenido)<=10) {
                        contenido = `${contenido}\n\nCasi aprobado`;
                    } else if (parseFloat(contenido)<=15) {
                        contenido = `${contenido}\n\nUn poco de esfuerzo para aprobar`;
                    } else if (parseFloat(contenido)<=20) {
                        contenido = `${contenido}\n\nCon fe, a rezar y estudiar`;
                    } else if (parseFloat(contenido)>20) {
                        contenido = `${contenido}\n\nDesaprobado`;
                    }

                }

                if (!change) {
                    let td = document.createElement('td');
                    fila.appendChild(td);
                    td.innerText = contenido;
                    td.setAttribute('rowspan',notas[i]['notas'].length);
                    td.setAttribute('align','center');
                } else {
                    let recuadros = fila.childNodes;
                    recuadros[recuadros.length-(3-lugar)].innerText = contenido;
                }
                
            }
            otra_asignatura = false;
            
        } else {
            if(Boolean(fila.childNodes[4]) &&
            Boolean(fila.childNodes[2].innerText=='Asignatura') ) {
                otra_asignatura = true;continue;
            }
            fila.childNodes[0].setAttribute(
                'colspan',
                11//parseInt(fila.childNodes[0].getAttribute('colspan'))+1
            );
            otra_asignatura = true;i++;continue;
        }
            
    }
}

var agregar_filas = ()=>{

    let ulti_fila = document.querySelector("#resul_tab > tbody > tr:last-child");
    let ultimo_es_separador = Boolean(ulti_fila.childNodes[0].getAttribute('colspan'));
    let ultimo_es_fila = Boolean(parseFloat(ulti_fila.childNodes[0].innerText));

    if (!ultimo_es_fila){
        let td = document.createElement('td');
        document.querySelector('#resul_tab tbody').appendChild(td);
        td.outerHTML = '<td contenteditable="true" align="center">99.</td><td contenteditable="true">CURSO NUEVO</td><td contenteditable="true">EVAL. CONTINUA 1</td><td align="center" contenteditable="true">A</td><td align="center" contenteditable="true">0</td><td align="center" contenteditable="true">15%</td><td align="center" contenteditable="true">No</td><td rowspan="1" align="center">3.3</td><td rowspan="1" align="center">11<br><br>Un poco de esfuerzo para aprobar</td><td rowspan="1" align="center">85%</td>';
    } else {
        let td = document.createElement('td');
        document.querySelector('#resul_tab tbody').appendChild(td);
        td.outerHTML = '<td contenteditable="true" align="center">99.</td><td contenteditable="true">CURSO NUEVO</td><td contenteditable="true">EVAL. CONTINUA 1</td><td align="center" contenteditable="true">A</td><td align="center" contenteditable="true">0</td><td align="center" contenteditable="true">15%</td><td align="center" contenteditable="true">No</td>';

let num_primeras_filas = document.querySelectorAll('#resul_tab > tbody > tr td:nth-last-child(3)[rowspan]').length-1;
let col_7=document.querySelectorAll('#resul_tab > tbody > tr td:nth-last-child(3)[rowspan]')[num_primeras_filas];
let col_8=document.querySelectorAll('#resul_tab > tbody > tr td:nth-last-child(2)[rowspan]')[num_primeras_filas];
let col_9=document.querySelectorAll('#resul_tab > tbody > tr td:nth-last-child(1)[rowspan]')[num_primeras_filas];

col_7.setAttribute('rowspan',parseInt(col_7.getAttribute('rowspan'))+1);
col_8.setAttribute('rowspan',parseInt(col_8.getAttribute('rowspan'))+1);
col_9.setAttribute('rowspan',parseInt(col_9.getAttribute('rowspan'))+1);
    }

}

var nuevo_separador = ()=>{
    let td = document.createElement('td');
    document.querySelector('#resul_tab tbody').appendChild(td);
    td.outerHTML = '<td colspan="11"><font color="maroon"><b>&nbsp;</b></font></td>';
};


var se_volvio_a_presionar = Boolean( document.querySelectorAll("#resul_tab > tbody > tr")[0].childNodes[16] );

if (!se_volvio_a_presionar){ //Primera vez presionando el botón de la extensión
    let info = document.querySelectorAll('body > div')[1];
    info.innerHTML = info.innerHTML+'&emsp;&emsp; <strong>Nota aprobatoria:</strong> <span contentEditable="true" id="nota-aprobatoria">10.5</span>';

    document.querySelectorAll('body > div').forEach(ele=>{ele.style.minWidth='650px';ele.style.width='95%';});

    document.querySelectorAll('body > div')[3].innerHTML = `Con fe, tú puedes... &emsp; &emsp; <button id="nueva-fila">Nueva fila</button> <button id="nuevo-separador">Nuevo separador</button> <button id="print" onclick="window.print();">Imprimir notas parciales</button>`;
    document.querySelector('#nueva-fila').addEventListener('click', agregar_filas);
    document.querySelector('#nuevo-separador').addEventListener('click', nuevo_separador);
}

var notas = obtenerNotas();
notas_faltantes();

addNota("Nota acumulada","promedioAcumulado",se_volvio_a_presionar,0);
addNota("Nota faltante para aprobar","faltante_nota_redondeada",se_volvio_a_presionar,1);
addNota("Peso faltante","faltante_peso",se_volvio_a_presionar,2);
