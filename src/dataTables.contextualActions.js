/* MIT License

Copyright (c) 2020 Tor Robinson

https://github.com/torrobinson/datatables-contextual-actions

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

// Configure our plugin
jQuery.fn.dataTable.Api.register('contextualActions()', function (options, dtOptions) {

	// Get our table references
	var dt = this.table();
  	var table = $(dt.container()).find('table');

	// DOM template for a dummy button element that we can use to preserve space in the button container, should it be used
	var dummyContent;
	if(options.buttonList.iconOnly){
		// Find the first icon in this list as the dummy
		var iconsWithButtons = options.items.filter(i => i.iconClass !== undefined && i.iconClass != '');
		var iconClassToEmulate;
		if(iconsWithButtons.length > 0){
			iconClassToEmulate = iconsWithButtons[0].iconClass;
		}
		else{
			iconClassToEmulate = 'fa-eye';
		}
	}

	var heightPreservationButton =
	'<!-- Dummy height preservation element --><div class="btn-group" style="width: 0px;opacity: 0.0;"><button class="btn" style="width: 0px;cursor: default !important;">'
	+ (options.buttonList.iconOnly ? ('<i class="'+options.iconPrefix+' ' +iconClassToEmulate+'"></i>') : '.') // only simulate button content if we're viewing more than icons
	+'</button></div>';

  	// Default our options
	if(options === undefined || options === null) options = {};
    var defaultOptions = {
		contextMenu:{
          	enabled: false,
            xoffset: 0,
            yoffset: 0,
            headerRenderer: function(){return '';},
          },
      	buttonList:{
          	enabled: false,
			iconOnly: false,
			reserveSpace: true
          },
		classes: [],
		iconPrefix: '',
		items: [],
		showSpeed: '0.30s'
    };
  	options = Object.assign({}, defaultOptions, options);

    // Context menu state
    var contextMenuId = table.id+'-context-menu';
    var rightClickedRowData = null;

    // Hides an open context menu
	function hideContextMenu(){

		// Deselect rows
		table.DataTable().rows().deselect();

		// Hide it
		$('#'+contextMenuId).removeClass('show').hide();
		rightClickedRowData = null;

		// Then destroy it
		destroyContextMenu(contextMenuId);
    }

    // Shows a context menu at the given offset from current mouse position
    function showContextMenuAt(x, y){
		// Create the context menu
		createContextMenu(contextMenuId, options.classes, options.iconPrefix, hideContextMenu ,options.items, rightClickedRowData);

		// Set its coordinates
		$("#"+contextMenuId).css({
			top: y + options.contextMenu.yoffset,
			left: x + options.contextMenu.xoffset
		});

		// Wait for next tick and then display
		setTimeout(function(){
			$('#'+contextMenuId).css({
				display: 'block',
				visibility: 'visible',
				opacity: 1,
				transform: 'translateY(0px)',
				transition: options.showSpeed + ' ease all'
			});
		},1);

		// Generate the header for the menu
		$('.dropdown-header').html(options.contextMenu.headerRenderer(rightClickedRowData));
    }

    // Ensure that clicks outside of the context menu dismiss it
    $(window).click(function() {
      if(
			$('#'+contextMenuId).is(":visible") // If the context menu is visible
			&& !$(event.target).closest('.dropdown-menu').length // And you're not clicking inside of the context menu
		)
		{hideContextMenu();} // Then hide it
    });

    // Destroy and reinitialize with some new options to support the plugin
    dt.destroy();

    var previousCreateRowCallback = function(){};
    if(dtOptions.createdRow !== undefined && typeof(dtOptions.createdRow) === 'function') previousCreateRowCallback = dtOptions.createdRow.bind({}); // The bind clones the function rather than references it. Otherwise we'd have an endless loop.

    // Set the createdRow override so that when rows are created, we can take over their right-click contextmenu event
    dtOptions.createdRow = function(row, data, dataIndex, cells) {

		// Bind the row to a right-click context menu invocation
		$(row).on('contextmenu', function(e){

			if(!options.contextMenu.enabled) return;

			// Hide context menu
			hideContextMenu();

			// Set the current row's data for access elsewhere
			rightClickedRowData = data;

			// Select the row
			table.DataTable().row($(row)).select();

			// Show context menu at mouse position
			showContextMenuAt(e.pageX, e.pageY);

			// Return false to prevent the browser context menu from appearing
			return false;
		});

		// Run any existing createRow callbacks that the user may have set
		previousCreateRowCallback(row, data, dataIndex, cells);
   	 };

    // Re-initialize with our updated options
    dt = $(table).DataTable(dtOptions);

   	// Bind to row selection
 	table.DataTable().on( 'select', function ( e, dt, type, indexes ) {
		if(type === 'row') {
			// Set selected rows
			var selectedRowIndexes = dt.rows( { selected: true } ).toArray()[0];
			var rows = table.DataTable().rows(selectedRowIndexes).data().toArray()
			refreshButtonsOnSelectionChanged(dt, options, rows)
		}
    });

    // Bind to deselection
    table.DataTable().on( 'deselect', function ( e, dt, type, indexes ) {
		if(type === 'row') {
			var selectedRowIndexes = dt.rows( { selected: true } ).toArray()[0];
			var rows = table.DataTable().rows(selectedRowIndexes).data().toArray()
			refreshButtonsOnSelectionChanged(dt, options, rows)
		}
    });

	// Immediately preserve button container height, if requested
	if(options.buttonList.reserveSpace){
		$(options.buttonList.buttonContainer).append($(heightPreservationButton));
	}

    // Show or hide the buttons based on row data
	function refreshButtonsOnSelectionChanged(dt, options, rows){
		// Do nothing if the user doesn't want buttons
		if(!options.buttonList.enabled) return;

		// Show buttons if there's rows selected
		if(rows.length > 0){
			//console.log(rows);
			updateButtons(options.buttonList, options.items, options.iconPrefix, rows);
		}
		// Hide buttons if there's no rows selected
		else{
			destroyButtonGroup(options.buttonList.buttonContainer);
			if(options.buttonList.reserveSpace){
				$(options.buttonList.buttonContainer).append($(heightPreservationButton));
			}
		}
	}

	// Helper to create a context menu
    function createContextMenu(id, classes, iconPrefix, destroy, items, row){
		var menu = $('<div id="'+id+'" class="dropdown-menu '+classes.join(' ')+'">');

		menu.css({
			display: 'block',
			visibility: 'hidden',
			opacity: 0,
			transform: 'translateY(-30px)',
			transition: '0.15s ease all'
		});

		// Add the header
		menu.append('<h6 class="dropdown-header"></h6>');

		// Add the items
		$.each(items, function(i, item)
		{
			// If this item shouldnt even be rendered, skip it
			if(typeof item.isHidden === "function" && item.isHidden(row)) return;

			// Handle dividers
			if(item.type === 'divider'){
				menu.append('<div class="dropdown-divider"></div>');
			}

			// Handle options
			else if(item.type === 'option'){
				var icon = '';
				if(item.iconClass !== undefined && item.icon !== ''){
					icon = '<i style="margin-right:15px;" class="'+iconPrefix+' '+item.iconClass+'"></i>';
				}

				var bootstrapClass = (item.bootstrapClass === undefined || item.bootstrapClass.trim === '') ? '' : 'text-' + item.bootstrapClass;

				var itemElement = $.parseHTML('<a class="dropdown-item '+item.classes.join(' ')+' '+bootstrapClass+'" style="cursor: pointer;">'+ icon + item.title+'</a>');

				if(typeof item.isDisabled === "function" && item.isDisabled(row)) $(itemElement).addClass('disabled').css('opacity','0.5');

				// On click, perform the action
				if(item.confirmation !== undefined){
					$(itemElement).click(function(){
						destroyContextMenu(id);
						onClickWithConfirmation(item, [row]);
					});
				}
				else{
					$(itemElement).click(function(){
						destroyContextMenu(id);
						item.action([row]);
					});
				}

				menu.append(itemElement);
			}
		});

		// Add the menu to the DOM
		$('body').append(menu);
    }

	// Helper to destroy the context menu
    function destroyContextMenu(id){
  		$('#'+id+'.dropdown-menu').remove();
    }

	// Helper to update the button list
    function updateButtons(options, items, iconPrefix, rows){
		destroyButtonGroup(options.buttonContainer);
		createButtonGroup(options, items, iconPrefix, rows);
    }

	// Helper to destroy the button list
    function destroyButtonGroup(container){
		$(container).empty();
    }

    // How exactly to create the buttons to render
    function createButtonGroup(options, items, iconPrefix, rows){
		if(rows.length === 0) return;

		var buttonGroupTemplate = '<div class="btn-group"></div>';

		var groups = [];
		var currentGroup = null;
		// Add the items
		$.each(items, function(i, item)
		{
			// Figure out which group we'll be adding things to
			if(currentGroup === null){
				// First iteration. New group.
				currentGroup = $(buttonGroupTemplate);
			}
			else if(i > 0 && item.type === 'divider'){
				// If the last item was a divider, then we need to package up the last group
				groups.push(currentGroup);

				// And start a new one
				currentGroup = $(buttonGroupTemplate);
				currentGroup.css('margin-left',options.dividerSpacing+'px');
				return;
			}


			// If this item shouldnt even be rendered, skip it
			if(typeof item.isHidden === "function" && rows.some(row => item.isHidden(row))) return;

			// Handle options
			else if(item.type === 'option'){
				var icon = '';
				var marginRight = options.iconOnly ? '' : 'margin-right:10px;';
				if(item.iconClass !== undefined && item.icon !== ''){
					icon = '<i style="'+marginRight+'" class="'+iconPrefix+' '+item.iconClass+'"></i>';
				}
				var bootstrapClass = (item.bootstrapClass === undefined || item.bootstrapClass.trim === '') ? '' : 'btn-' + item.bootstrapClass;
				if(bootstrapClass === '') bootstrapClass = options.defaultBootstrapClass;

				// Build what the user will see in the button
				var buttonContents = '';

				if(!options.iconOnly) buttonContents = icon + item.title;
				else buttonContents = icon;

				var title = options.iconOnly ? (item.title+ (rows.length > 1 ? ' ('+rows.length+')' : '')) : '';
				var itemElement = $.parseHTML('<button class="btn '+item.classes.join(' ')+' '+bootstrapClass+'" title="'+ title +'" >'+ buttonContents +'</button>');
				// If we're icon- only force immediate and obvious tooltips
				if(options.iconOnly)$(itemElement).tooltip();

				if(
					((item.multi === undefined || item.multi === false) && rows.length > 1) // If the item isn't a multi-action and yet there's more than 1 row selected,
					|| (typeof item.isDisabled === "function" && rows.some(row => item.isDisabled(row))) // Or the item should be disabled,
				)
				{
					// Then disable it
					$(itemElement).addClass('disabled');
					$(itemElement).attr('disabled', 'disabled');
					$(itemElement).css('cursor','not-allowed');
					$(itemElement).css('opacity','0.5');
				}
				else if(!options.iconOnly && rows.length > 1){
					// Add the count of selected rows to the title, if the user doesn't want to just see the icon
					$(itemElement).append(' ('+rows.length+')');
				}

				// On click, perform the action
				if(item.confirmation !== undefined){
					$(itemElement).click(function(){onClickWithConfirmation(item, rows)});
				}
				else{
					$(itemElement).click(function(){
						item.action(rows);
					});
				}

				// Append it to the current btn-group
				currentGroup.append(itemElement);
			}
		});

		// Then push the btn-gorup to the master list
		groups.push(currentGroup);

		// Now push all the btn-groups into the parent container and bob's your uncle
		$.each(groups, function(i, group){
			$(options.buttonContainer).append(group);
		});
    }

	// Execute a confirmation action
    function onClickWithConfirmation(item, rows){
		var confirmation = item.confirmation(rows);
		confirmation.callback = function(confirmed){
			if(confirmed){
				if(rows.length > 1){
					for(var i=0; i<rows.length;i++){
						item.action([rows[i]]);
					}
				}
				else item.action([rows]);
			}
		};
		bootbox.confirm(confirmation);
    }
});
