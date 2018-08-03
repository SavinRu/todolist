var todoList = [
	{text: 'Hit the gym', checked: false},
	{text: 'Pay bills', checked: true},
	{text: 'Meet George', checked: false},
	{text: 'Buy eggs', checked: true},
	{text: 'Read a book', checked: false},
	{text: 'Organize office', checked: false}
];

/*var serialObj = JSON.stringify(todoList); //сериализуем его

localStorage.setItem("myList", serialObj); //запишем его в хранилище по ключу "myKey"*/

var returnObj = JSON.parse(localStorage.getItem("myList")) //спарсим его обратно объект


$( document ).ready(function() {
	var returnObj = JSON.parse(localStorage.getItem("myList"));
	if(returnObj){
		todoList = returnObj.slice(0);
		addElements(todoList);
	}
	else{
		addElements(todoList);
	}
	
	sortListDir();
});


function addElements(Arr){
	Arr.forEach(function(item, i, arr) {
		addElem(item.text, item.checked);
	});
};

function addElem(text, checked){
	if(checked){
		$('#myUL').append('<li class="checked"><div class="li-text">'+text+'</div></li>');
		$('#myUL li').last().append('<input>');
		$('#myUL li').last().append('<div class="saveBtn">save</div>');
		$('#myUL li').last().append('<div class="cancelBtn">cancel</div>');
		$('#myUL li').last().append('<div class="edit">edit</div>');
		$('#myUL li').last().append('<div class="close">\u00D7</div>');
	}else{
		$('#myUL').append('<li class=""><div class="li-text">'+text+'</div></li>');
		$('#myUL li').last().append('<input>');
		$('#myUL li').last().append('<div class="saveBtn">save</div>');
		$('#myUL li').last().append('<div class="cancelBtn">cancel</div>');
		$('#myUL li').last().append('<div class="edit">edit</div>');
		$('#myUL li').last().append('<div class="close">\u00D7</div>');
	}
}

$('body').on('click', '.close', function() {
	let index;
	for(let i = 0; i < todoList.length; i += 1) {
        if(todoList[i]['text'] === $(this).closest('li').find('.li-text').text()) {
            index = i;
        }
    }
	todoList.splice(index,1);
	let serialObj = JSON.stringify(todoList); 
	localStorage.setItem("myList", serialObj);
    $(this).closest('li').remove();
});

function newElement() {
	let text = $('#myInput').val();
	if(text === ''){
		alert("You must write something!");
	}
	else{
		addElem(text, false);
		todoList.push({text: text, checked: false});
		
		let serialObj = JSON.stringify(todoList); 
		localStorage.setItem("myList", serialObj);
		
		$('#myInput').val('');
	}
	
	sortListDir();
} 

function sortListDir() {
  let i, switching, b, shouldSwitch, dir, switchcount = 0;
  switching = true;
  // Set the sorting direction to ascending:
  dir = "desc";
  // Make a loop that will continue until no switching has been done:
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    b = $('#myUL li');
    // Loop through all list-items:
    for (i = 0; i < (b.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Check if the next item should switch place with the current item,
      based on the sorting direction (asc or desc): */
      if (dir == "asc") {
        if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
          /* If next item is alphabetically lower than current item,
          mark as a switch and break the loop: */
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (b[i].innerHTML.toLowerCase() < b[i + 1].innerHTML.toLowerCase()) {
          /* If next item is alphabetically higher than current item,
          mark as a switch and break the loop: */
          shouldSwitch= true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
      // Each time a switch is done, increase switchcount by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      /*if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }*/
    }
  }
}

$('body').on('click', '.edit', function(e) {
	e.preventDefault();
	e.stopPropagation();
	closeEditAll();
	let that = this;
	
	$(this).closest('li').find('input').val( $(this).closest('li').find('.li-text').text());
	
	showEdit.apply(that);
});

$('body').on('click', '.saveBtn', function(e) {
	e.preventDefault();
	e.stopPropagation();
	let that = this;
	let index;
	for(let i = 0; i < todoList.length; i += 1) {
        if(todoList[i]['text'] === $(this).closest('li').find('.li-text').text()) {
            index = i;
        }
    }
	todoList[index]['text'] = $(this).closest('li').find('input').val();
	let serialObj = JSON.stringify(todoList); 
	localStorage.setItem("myList", serialObj);
	$(this).closest('li').find('.li-text').text( $(this).closest('li').find('input').val());
	
	closeEdit.apply(that);
});

$('body').on('click', '.cancelBtn', function(e) {
	e.preventDefault();
	e.stopPropagation();
	let that = this;
	closeEdit.apply(that);
});

$('body').on('click', '#myUL li input', function(e) {
	e.preventDefault();
	e.stopPropagation();
});

$('body').on('click', '#myUL li', function() {
    $(this).toggleClass('checked');
});

function showEdit(){
	//console.log($(this));
	$(this).closest('li').find('.li-text').hide();
	$(this).closest('li').find('.edit').hide();
	$(this).closest('li').find('.close').hide();
	$(this).closest('li').find('input').show();
	$(this).closest('li').find('.saveBtn').show();
	$(this).closest('li').find('.cancelBtn').show();
}

function closeEdit(){
	//console.log($(this));
	$(this).closest('li').find('.li-text').show();
	$(this).closest('li').find('.edit').show();
	$(this).closest('li').find('.close').show();
	$(this).closest('li').find('input').hide();
	$(this).closest('li').find('.saveBtn').hide();
	$(this).closest('li').find('.cancelBtn').hide();
}

function closeEditAll(){
	$('#myUL li').each(function(i,elem){
		$(elem).find('.li-text').show();
		$(elem).find('.edit').show();
		$(elem).find('.close').show();
		$(elem).find('input').hide();
		$(elem).find('.saveBtn').hide();
		$(elem).find('.cancelBtn').hide();
	});
}



























