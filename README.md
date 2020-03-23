# datatables-contextual-actions
## [View Example](https://torrobinson.github.io/datatables-contextual-actions/)

A DataTables JS extension for adding contextual options to one or many selected rows.

![Context Menu][ContextManu]

![Button List][ButtonList]

![Button List Icon Only][ButtonListIconOnly]

This will alter your table in the following ways:
- Right-clicking a row will select it and present the user with a context menu of your actions
- Selecting any number of rows will present the user with a single row of buttons with your actions

# Dependencies:
- [DataTables](https://github.com/DataTables/DataTables)
- [Bootbox.js](http://bootboxjs.com/)
- [Bootstrap 4](https://getbootstrap.com/)
- [FontAwesome](https://fontawesome.com/)

# Configuration:
```javascript
{
    contextMenu:{
        // Whether to show the context menu or not
        enabled: true,

        // The offset from the mouse where the context menu is drawn
        xoffset: -10,
        yoffset: -10,

        // A renderer for the header text in the context menu
        headerRenderer: function(row){
            return row[1] + ' - ' + row[2];
        },
    },
    buttonList:{
        // Whether to show the button list or not
        enabled: true,

        // Whether or not to ONLY show icons in the buttons, with tooltips showing the titles
        iconOnly: false,

        // Whether to reserve the vertical space for the button list, even if it's not being displayed
        reserveSpace: true,

        // Where to draw the button list on the screen
        buttonContainer: $('#dt-row-buttons'),

        // The spacing (in pixels) between buttons when a divider is present
        dividerSpacing: 10,

        // The default button class to assign buttons
        defaultBootstrapClass: 'btn-light'
    },
    // What prefix class to assign icons
    iconPrefix: 'fa fa-fw',

    // Your actions
    items: [

        // You can add dividers to break up your items into groups,
        {
            type: 'divider'
        },

        // Or specify an action
        {
            // Type is either "divider" or "option"
            type: 'option',

            // The text for your action
            title: 'Unassign',

            // Whether or not it can be clicked/ran when more than 1 row is selected
            multi: true,

            // The icon to display before the title
            iconClass: 'fa-user-alt-slash',

            // Any additional CSS classes to assign to the item
            classes: [],

            // The bootstrap color class to assign (example: danger, warning, success, etc)
            bootstrapClass: 'danger',

            // Determine whether to disable the action or not, based on logic on an individual row. If > 1 rows are selected and ANY pass this test, the option will be disabled
            isDisabled: function(row){
                return false;
            },

            // Determine whether to hide / not render the action entirely. If > 1 rows are selected and ANY pass this test, the option will be hidden
            isHidden: function(row){
                return false;
            },

            // Optional bootboxjs confirmation. Specify what you'd normally use in a bootboxjs configuration, except for the callback.
            // Use the incomine array of rows to determine what you are confirming
            confirmation: function(rows){
                var message = 'Are you sure you want to unassign ' + (rows.length > 1 ? (rows.length +' roles?') : rows[0][1] + '\'s role?');
                return {
                    title: rows.length > 1 ? 'Unassign Employees' : 'Unassign Employee',
                    message: message,
                    buttons: {
                        cancel: {
                            className: 'btn-link',
                            label: 'Cancel'
                        },
                        confirm: {
                            className: 'btn-danger',
                            label: '<i class="fas fa-user-slash"></i> Unassign'
                        }
                    }
                };
            },

            // The action to take place on the rows selected. If confirmation (above) is specified, this is only executed if the user confirms the action
            action: function(rows){
                // Do a bulk operation with rows here
                for(var i=0; i<rows.length;i++){
                    // Or do a singular thing with each row here
                }
            }
        },

        // Example of a simple action:
        {
            type: 'option',
            multi: false,
            title: 'Edit',
            iconClass: 'fa-edit',
            action: function(row){
                // Show edit screen here
            }
        },
    ]
}
```

# Initialization:
Initialization requires 2 things: your contextualActions configiration as described above, and your DataTables configuration, to ensure any existing options are persisted.

For example:
```javascript
$(document).ready( function () {
    // Set up our table in standard DataTables fashion
    var dataTablesOptions = {
        select: {
            style:    'os',
            selector: 'td:first-child'
        }
    };
    var myTable = $('#dt').DataTable(dataTablesOptions);


    // Then set up some action options
    var actionOptions = {}; // refer to the configuration section above

    // And initialize our plugin. Since we recreate the table internally, return the modified table as part of initialization.
    myTable = myTable.contextualActions(actionOptions,dataTablesOptions);
});
```

[ContextManu]: https://github.com/torrobinson/datatables-contextual-actions/blob/master/resources/context-menu.png "Context Menu"
[ButtonList]: https://github.com/torrobinson/datatables-contextual-actions/blob/master/resources/buttons.png "Button List"
[ButtonListIconOnly]: https://github.com/torrobinson/datatables-contextual-actions/blob/master/resources/buttonIconOnly.png "Button List Icon Only"
