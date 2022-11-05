//api fetch//
const monedaEl_one = document.getElementById('moneda-uno');
const monedaEl_two = document.getElementById('moneda-dos');
const cantidadEl_one = document.getElementById('cantidad-uno');
const cantidadEl_two = document.getElementById('cantidad-dos');
const cambioEl = document.getElementById('cambio');
const tazaEl = document.getElementById('taza');


// Fetch Exchange Rate and Update the DOM
function calculate(){
    const moneda_one = monedaEl_one.value;
    const moneda_two = monedaEl_two.value;

   fetch(`https://api.exchangerate-api.com/v4/latest/${moneda_one}`)
   .then(res => res.json() )
   .then(data => {
       const taza = data.rates[moneda_two];
       
       cambioEl.innerText = `1 ${moneda_one} = ${taza} ${moneda_two}`;

       cantidadEl_two.value = (cantidadEl_one.value * taza).toFixed(2);

    } );
    
}

//Event listeners
monedaEl_one.addEventListener('change', calculate);
cantidadEl_one.addEventListener('input', calculate);
monedaEl_two.addEventListener('change', calculate);
cantidadEl_two.addEventListener('input', calculate);

taza.addEventListener('click', () =>{
    const temp = monedaEl_one.value;
    monedaEl_one.value = monedaEl_two.value;
    monedaEl_two.value = temp;
    calculate();
} );


calculate();
     
class UI {
    constructor() {
        // Datos Cargados por USUARIO
        // Datos Ingresos UI
        this.genericForm = $(".generic-form");
        this.feedbackNotif = $("#feedback-notification");
        this.numberInput = $("#number-input");
        this.textInput = $("#text-input");
        this.category = $("#generic-category");
        this.account = $("#generic-account");
        this.dateInput = $("#generic-date");

        // Seleccion Ingreso o Gasto
        this.incomeBtn = $("#selectBudget");
        this.expenseBtn = $("#selectExpense");
        this.typeSelect = $("#typeSelection");

        // APP INFO VALORES
        this.budgetAmount = $("#budget-amount");
        this.expenseAmount = $("#expense-amount");
        this.balanceAmount = $("#balance-amount");
        this.balance = $("#balance");

        // Listas Ingresos / Gastos

        this.totalList = $("#total-list");
        this.itemID = 0; //valor unico e irrepetible

        this.itemExpenseList = []; //Lista de Gastos
        this.itemBudgetList = []; //Lista de Ingresos
        this.itemTotalList = []; //Listado Completo de Gastos e Ingresos para guardar
        this.expenseList = $("#expense-list");
        this.budgetList = $("#budget-list");
    }

    // Declaramos los Metodos
    // Grabar item cargado ("Submit")
    submitForm(valor) {

        // guardo los valores cargados por UI
        const fecha = this.dateInput.val();
        const account = this.account.val();
        const category = this.category.val();
        const amount = this.numberInput.val();
        const title = this.textInput.val();

        if ((this.checkForm() && (amount > 0))) { //condicion si todo esta Ok
            //Para dejar todos los valores vacios
            /*$('input[type=text]').each(function () {
                $(this).val('');
            });*/

            this.dateInput.val('');
            this.account.val('');
            this.category.val('');
            this.numberInput.val('');
            this.textInput.val('');
            // Feedback OK - Carga Exitosa
            this.feedbackNotif.fadeIn(1500).delay(3000).fadeOut(1500);
            //this.feedbackNotif.addClass('showItem');
            this.feedbackNotif.html(`<p> Carga exitosa </p>`);
            this.feedbackNotif.removeClass('alert-danger');
            this.feedbackNotif.addClass('alert-success');
            
            if (valor === true) {
                 
                // Creo objeto INCOME
                const income = {
                    id: this.itemID,
                    date: fecha,
                    title: title,
                    amount: parseInt(amount),
                    category: category,
                    type: "budget",
                    account: account,
                }
                this.itemID++;
                this.itemBudgetList.push(income);
                this.itemTotalList.push(income); // GUARDO en una lista total para posterior JSON

                $('#form-submit').fadeOut(800);
                $('#selectBudget').removeClass("selectedBudget");
                $('#selectExpense').removeClass("selectedExpense");
                // Instancio funciones creadas
                this.appendItem(income);
                this.showBalance();

            } else {
                // Creo objeto EXPENSE
                const expense = {
                    id: this.itemID,
                    date: fecha,
                    title: title,
                    amount: parseInt(amount),
                    category: category,
                    type: "expense",
                    account: account,
                }
                this.itemID++;
                this.itemExpenseList.push(expense);
                this.itemTotalList.push(expense); // GUARDO en una lista total para posterior JSON

                $('#form-submit').fadeOut(800);
                $('#selectBudget').removeClass("selectedBudget");
                $('#selectExpense').removeClass("selectedExpense");
                // Instancio funciones creadas
                this.appendItem(expense);
                this.showBalance();
            }

        } else { //condicion si hay algo erroneo
            this.feedbackNotif.fadeIn(1500).delay(3000).fadeOut(1500);
            this.feedbackNotif.html(`<p> Verifique los datos o completelos</p>`);
            this.feedbackNotif.removeClass('alert-success');
            this.feedbackNotif.addClass('alert-danger');

        }
    }

    checkForm() {
        let controlOk = false;
        let checkFormOk = null;
        //Array de los inputs del Formulario
        const formArray = [this.numberInput,
            this.textInput, this.category,
            this.account, this.dateInput
        ];
        let controlArray = [];
        for (const iterator of formArray) {
            if (iterator.val() === "" || iterator.val() < 0) {
                iterator.removeClass("correctField").addClass("errorField")
                let span = iterator.parent().parent().children()[2];
                span.classList.remove("hideItem")
                controlOk = false;
            } else {
                iterator.removeClass("errorField").addClass("correctField");
                let span = iterator.parent().parent().children()[2];
                span.classList.add("hideItem")
                controlOk = true;
            }
            controlArray.push(controlOk);
        }
        // Verifico que en el array no haya valores falsos
        if (controlArray.reduce((curr, acc) => acc + curr) == controlArray.length) {
            checkFormOk = true;
        } 
        else {
            checkFormOk = false;
        }
        return checkFormOk;
    }
/*ojo*/
    // appendItem (agregar GASTO o INGRESO) 
    // appendItem(item) {
    //     this.totalList.prepend(
    //     <div class="${item.type} btn-light" id="${item.type}${item.id}">
    //         <div class="${item.type}-item d-flex justify-content-between align-items-center">
    //             <div class="col-2 ${item.type}-list-item">${item.date}</div>
    //             <div class="col-2 ${item.type}-list-item text-uppercase">${item.title}</div>
    //             <div class="col-2 ${item.type}-list-item ${item.type}Amount">$ ${item.amount}</div>
    //             <div class="col-2 ${item.type}-list-item">Gasto</div>
    //             <div class="col-2 ${item.type}-list-item">${item.category}</div>
    //             <div class="col-2 ${item.type}-icons">
    //                 <div class="row justify-content-center">
    //                     <span href="#" class="edit-icon mx-2" data-id="${item.id}">
    //                         <ion-icon name="create" size="large" id="edit-button"></ion-icon>
    //                     </span>
    //                     <span href="#" class="delete-icon" data-id="${item.id}">
    //                         <ion-icon name="trash" size="large" id="delete-button"></ion-icon>
    //                         <button class="btn btn-sm btn-danger" id="delete-button">borrar</button>
    //                     </span>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    //     )
    // }
    // mostrar Balance
    showBalance() {
        const expense = this.totalExpense();
        const budget = this.totalBudget();
        // Calculo el balance (Ingreso - Gastos)
        const total = budget - expense;
        this.balanceAmount.text(total);
        // Condiciones Si total es <> 0
        if (total < 0) {
            console.log('menor a 0');
            $("#divApp-balance").addClass('btn-danger');
            $("#divApp-balance").removeClass('btn-success btn-dark');

        } else if (total > 0) {
            console.log($("#divApp-balance"));
            $("#divApp-balance").addClass('btn-success');
            $("#divApp-balance").removeClass("btn-danger btn-dark");

        } else if (total === 0) {
            console.log('igual a 0');
            $("#divApp-balance").addClass('btn-dark');
            $("#divApp-balance").removeClass('btn-success btn-danger');
        }

    }

    // Calculo el Ingreso Total (totalbudget)
    totalBudget() {
        let totalBudget = 0;
        if (this.itemBudgetList.length > 0) {
            totalBudget = this.itemBudgetList.reduce(function (acc, curr) { // reduce suma el valor actual(curr) al valor acumulado, va recorriendo todo el array
                acc += curr.amount;
                return acc;
            }, 0);

        }
        this.budgetAmount.text(totalBudget); //Actualizo el valor mostrado

        return totalBudget;
    }
    // Calculo el Gasto Total (totalExpense)
    totalExpense() {
        let totalExpense = 0;
        if (this.itemExpenseList.length > 0) {
            totalExpense = this.itemExpenseList.reduce(function (valAcum, valCorriente) {
                valAcum += valCorriente.amount; //Le sumo el valor actual al acumulado (x cada item de la lista)
                return valAcum; // Tengo que devolver este valor para que la funcion ande correctamente
            }, 0);

        }
        this.expenseAmount.text(totalExpense); // Muestro el total en el balance
        return totalExpense;
    }
    // edit List Item 
    editItem(element) {
        let id = parseInt(element.dataset.id);
        let parent = element.parentElement.parentElement.parentElement.parentElement;

        if (parent.classList.contains('expense')) { // El elemento es un gasto

            parent.remove();
            //seleccion de la lista el elemento
            let expense = this.itemExpenseList.filter((item) => {
                return item.id === id
            });
            // remuevo el elemnto de la lista y reemplazo la nueva lista sin ese elemento
            let tempList = this.itemExpenseList.filter((item) => {
                return item.id !== id
            });
            this.itemExpenseList = tempList;
            this.showBalance();

            //show value en editor
            this.numberInput.val(expense[0].amount);
            this.textInput.val(expense[0].title);
            this.category.val(expense[0].category);
            this.account.val(expense[0].account);
            this.dateInput.val(expense[0].date);
            this.textInput.val(expense[0].title);
            this.numberInput.val(expense[0].amount);
            
        }
        else if (parent.classList.contains('budget')) { // El elemento es un ingreso (Budget)

            parent.remove();
            // elimino el elemento de la lista Budget
            let budget = this.itemBudgetList.filter((item) => {
                return item.id === id
            }); //Agarro el objeto
            let tempList = this.itemBudgetList.filter((item) => {
                return item.id !== id
            }); // me genero una lista temporal
            // genero el nuevo listado sin el elemento
            this.itemBudgetList = tempList;
            this.showBalance();

            //show value en editor
            this.numberInput.val(budget[0].amount);
            this.textInput.val(budget[0].title);
            this.category.val(budget[0].category);
            this.account.val(budget[0].account);
            this.dateInput.val(budget[0].date);
            this.textInput.val(budget[0].title);
            this.numberInput.val(budget[0].amount);
        }
    }
    // delete Item List EXPENSE / INCOME
    deleteItem(element) {
        let id = parseInt(element.dataset.id);
        let parent = element.parentElement.parentElement.parentElement.parentElement;

        if (parent.classList.contains('expense')) {
            parent.remove();
            // El elemento es un gasto
            // remuevo el elemnto de la lista y reemplazo la nueva lista sin ese elemento
            let tempList = this.itemExpenseList.filter((item) => {
                return item.id !== id
            });
            this.itemExpenseList = tempList;
            this.showBalance();
        } else if (parent.classList.contains('budget')) {
            parent.remove();

            // El elemento es un ingreso (Budget)
            let tempList = this.itemBudgetList.filter((item) => {
                return item.id !== id
            }); // me genero una lista temporal
            // genero el nuevo listado sin el elemento
            this.itemBudgetList = tempList;
            this.showBalance();
        }
    }


}
//Corremos esta funcion una vez corrio y se cargo el DOM
// Dispone de todos los eventos
function eventListeners() {
    const genericForm = $("#generic-form");
    const totalList = $("#total-list");
    const typeSelect = $("#typeSelection");
    const btnListado = $("#btnListado");
    const $LoadJson = $('#btnLoadJson');
    const $SaveJson = $('#btnSaveJson');
    let ingresoBtn = null;
    let egresoBtn = null;

    // Instancio la clase UI (UserInterface)
    const ui = new UI();

    ////////////////////////////////////
    //////////     EVENTOS  ///////////
    //////////////////////////////////

    // Seleccion de Ingreso o Egreso
    typeSelect.click(function (event) {
        ingresoBtn = null;
        egresoBtn = null;
        if (event.target.id === 'selectBudget') {

            ingresoBtn = true;
            egresoBtn = !ingresoBtn;
            $("#form-submit").removeClass("btn-outline-dark btn-outline-danger").addClass("btn-outline-primary");
            $('#selectBudget').addClass("selectedBudget");
            $('#selectExpense').removeClass("selectedExpense");
            // Habilito el boton de Guardado de Informacion
            $('#form-submit').slideDown(500);
            //$('#form-submit').prop('disabled', false);

        } else if (event.target.id === 'selectExpense') {
            egresoBtn = true;
            ingresoBtn = !egresoBtn;
            $("#form-submit").removeClass("btn-outline-dark btn-outline-primary").addClass("btn-outline-danger");
            $('#selectBudget').removeClass("selectedBudget");
            $('#selectExpense').addClass("selectedExpense");
            // Habilito el boton de Guardado de Informacion
            $('#form-submit').slideDown(500);
            //$('#form-submit').prop('disabled', false);
        }

    });


    // Form submit
    genericForm.submit(function (event) {
        event.preventDefault();
        if (ingresoBtn) { //Boton Ingreso Seleccionado
            ui.submitForm(ingresoBtn);
        } else if (egresoBtn) { //Boton Egreso Seleccionado
            ui.submitForm(ingresoBtn);
        }
    });

    // Total List Click event
    totalList.click(function (event) {
        let element = event.target.parentElement
        let id = parseInt(element.dataset.id);

        if (element.classList.contains('edit-icon')) {

            ui.editItem(element);
            // Voy a la parte superior para Editar el Formulario
            $('html, body').animate({
                scrollTop: 0
            }, 800);

        } else if (element.classList.contains('delete-icon')) {
            ui.deleteItem(element);
        }
    });




    // Evento de oprimir boton "Mostrar Listado" para ver cargas
    btnListado.click(() => {
        mostrarListado();
    })

    // Implementando JSON y AJAX
    $LoadJson.click(() => {

        $.getJSON("../data/dataTotalList.json", function (result) {
            $.each(result, function (i, item) {
                if (item.type === "budget") {
                    ui.itemBudgetList.push(item);
                    ui.appendItem(item);
                    ui.showBalance();
                } else if (item.type === "expense") {
                    ui.itemExpenseList.push(item);
                    ui.appendItem(item);
                    ui.showBalance();
                }
            })
        })
    })
    $SaveJson.click(() => {
        // Todavia no esta implementado
        console.log(ui.itemTotalList);
    })

    // Boton para top pagina
    var amountScrolled = 120;

    $(window).scroll(function () {
        if ($(window).scrollTop() > amountScrolled) {
            $('button.btnBackTop').addClass("show");
        } else {
            $('button.btnBackTop').removeClass("show");
        }
    });

    // Con el boton voy arriba de todo
    $('button.btnBackTop').click(function () {
        aTopDePagina()
    });

}
// Funcion para ir al principio de la pagina
function aTopDePagina() {
    $('html, body').animate({
        scrollTop: 0
    }, 800);
}
// Toggle para Mostrar Listado de Gastos / Ingresos
function mostrarListado() {
    $("#div-Listado").toggle("slow");
    $("html, body").animate({
        scrollTop: $(document).height()
    }, 1000) //Voy al final del documento para ver el listado
}

 
// Funcion de carga de pagina
function firstLoad() {
    let timer = 1000

    $('header').fadeIn(timer);
    // Cargamos el primer paso
    setTimeout(() => {
        $('#nro1').addClass('show');
        $('#selectBudget').fadeIn(timer + 500);
        $('#selectExpense').fadeIn(timer + 500);
        setTimeout(() => {
            //Cargamos el segundo paso
            $('#nro2').addClass('show');
            let hijosForm = $("#generic-form").children();
            let cont = 1;
            $("#generic-form").slideDown(timer * 1.5);
            for (const formInput of hijosForm) {
                $(`#generic-form${cont}`).removeClass('hideItem');
                cont += 1;
                if (cont === 6) {
                    break
                }
            }
            setTimeout(() => {
                //Cargamos el tercer paso
                $('#nro3').addClass('show');
                $('#divApp-budget').slideDown(timer);
                $('#divApp-expense').slideDown(timer);
                $('#divApp-balance').slideDown(timer * 1.5);
                setTimeout(() => {
                    //Cargamos el Boton de Listado
                    $('#nro4').addClass('show');
                    $('#btnListado').fadeIn(timer);
                    setTimeout(() => {
                        mostrarListado();
                        $('#footer').slideDown(timer);
                        setTimeout(() => {
                            $('#div-Listado').toggle("slow");
                            aTopDePagina();
                            $('#nro1').fadeOut(timer);
                            $('#nro2').fadeOut(timer);
                            $('#nro3').fadeOut(timer);
                            $('#nro4').fadeOut(timer);
                        }, timer);
                    }, timer);
                }, timer);
            }, timer);
        }, timer);
    }, timer);

}

function alreadyVisited() {
    let timer = 1500;
    $('#nro1').hide();
    $('#nro2').hide();
    $('#nro3').hide();
    $('#nro4').hide();
    $('header').fadeIn(timer);
    $('#selectBudget').fadeIn(timer + 500);
    $('#selectExpense').fadeIn(timer + 500);
    let hijosForm = $("#generic-form").children();
            let cont = 1;
            $("#generic-form").slideDown(timer * 1.5);
            for (const formInput of hijosForm) {
                $(`#generic-form${cont}`).removeClass('hideItem');
                cont += 1;
                if (cont === 6) {
                    break
                }
            }
    $('#divApp-budget').fadeIn(timer*3);
    $('#divApp-expense').fadeIn(timer*3);
    $('#divApp-balance').slideDown(timer * 1.5);
    $('#btnListado').fadeIn(timer*4);
    $('#footer').fadeIn(timer*5);

}
//////////////////////////////////////////////////////////////////////////////////////
// Este evento DOMContentLoaded es disparado cuando el documento HTML ha sido completamente cargado

$(document).ready(function () {
    //Verifico si ya entro alguna vez ese usuario
    const userVisit = true;
    if (userVisit !== true) {
        
        alreadyVisited();

    } else {
        // Realizo las animaciones de primera visita a la pagina
        firstLoad();
    }


    //Aplico los eventos
    eventListeners();
})