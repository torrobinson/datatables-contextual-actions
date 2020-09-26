

# datatables-contextual-actions



[TOC]



## [View Example](https://torrobinson.github.io/datatables-contextual-actions/docs/)

A DataTables JS extension for adding contextual options to one or many selected rows.

![Context Menu][ContextMenu]

![Button List][ButtonList]

![Button List Icon Only][ButtonListIconOnly]

This will alter your table in the following ways:
- Right-clicking a row will select it and present the user with a context menu of your actions
- Selecting any number of rows will present the user with a single row of buttons with your actions

# Dependencies:
- [DataTables](https://github.com/DataTables/DataTables)

# Configuration:



## options

| Property | Type | Description | Default |
|-|-|-|-|
| **classes** | string[] | CSS classes to apply to both the dropdown-menu and the button container | `[]` |
| **iconPrefix** | string | CSS class that icons will all start with.<br>For example, providing `'fas'` will default an icon to<br>`<i class="fas"></i>`<br><br>...before it's assigned its actual icon class.  | `''` |
| **showSpeed**  | string | A CSS duration describing how quickly the context menu should be displayed  | `'0.30s'` |
| **contextMenu**| **contextMenu** (see below) | | required |
| **showConfirmationMethod**  | function(confirmation)| A function taking in a `confirmation` object (see the documentation on `item`'s `confirmation` attribute) that handles how to render and show the confirmation to the user. By default this uses the super basic `window.confirm` but the incoming `confirmation` parameter matches the config of BootBox, a plugin for showing confirmations using Bootstrap's modals. If using Bootbox, replace with `function(confirmation){bootbox.confirm(confirmation)}`  |`function(confirmation){ confirmation.callback( window.confirm( confirmation.message)); }`|
| **buttonList** | **buttonList** (see below) |   | required |
| **items**|**item**[] (see below)| An array of `item` objects that represent the options that will be both rendered as buttons, and as options in a context menu. | required  |



## options.contextMenu

| Property           | Type                          | Description                                                  | Default |
| ------------------ | ----------------------------- | ------------------------------------------------------------ | ------- |
| **enabled**        | bool                          | Whether or not to display a context menu when the user right-clicks a row | `true`  |
| **xoffset**        | int                           | The horizontal distance away, in pixels, to render the drop-down context menu from the mouse | `-10`   |
| **yoffset**        | int                           | The vertical distance away, in pixels, to render the drop-down context menu from the mouse | `-10`   |
| **headerRenderer** | string<br>or<br>function(row) | What to display as the context menu's header.<br><br>Can be a static string or a function of the <br>right-clicked row. | `''`    |



## options.buttonList

| Property              | Type    | Description                                                  | Default  |
| --------------------- | ------- | ------------------------------------------------------------ | -------- |
| **enabled**           | bool    | Whether or not to render the options out into an external container as a series of button groups | `true`   |
| **containerSelector** | string  | The CSS selector of the container element that the buttons will be rendered into.<br><br>For example, `'#my-button-bar'` | required |
| **iconOnly**          | bool    | Whether or not to only display icons in the buttons.<br><br>If `true`, buttons will only contain icons, and the option titles are turned into tooltips. | `true`   |
| **disabledOpacity**   | decimal | The opacity of a disabled button or context menu icon        | `0.5`    |
| **dividerSpacing**    | int     | The number of pixels between divided groups of buttons       | `10`     |
| **groupClass**        | string  | The class to give to the groups of buttons in the button list. Groups are the groupings of buttons separated with `divider` typed items. For example, with bootstrap, use `btn-group` | ``       |



## options.item[]

| Property                 | Type                           | Description                                                  | Default  |
| ------------------------ | ------------------------------ | ------------------------------------------------------------ | -------- |
| **type**                 | string                         | <br>Items can be of the following types:<br><br><ul><br><li>`option` is the standard type. It means the option is row-scoped and relies on row data to determine its `action`.</li><br><br><li>`static` means its action will not receive any data, and it mimics a DataTables button in that it is always visible and is table-scoped, not row-scoped.</li><br><br><li>`divider` acts simply as a divider item that splits up the above types when being rendered.</li><br></ul> | required |
| **multi**                | bool                           | Whether or not to enable this button when more than 1 rows are selected | `false`  |
| **title**                | string                         | <br>What the option is named.<br>The title is rendered as:<br><ul><br><li>In buttons: the button text</li><br><li>In buttons when `iconOnly` is `true`: the button's tooltip</li><br><br><li>In context menus: the dropdown option's text</li><br><br><ul> | ''       |
| **multiTitle**           | string                         | The `title` (above) to render when more than 1 rows are selected | ''       |
| **iconClass**            | string                         | The class of the `<i></i>` styled icon to render.<br>For example, if `iconPrefix` is `'fa fa-fw'` and `iconClass` is `'fa-eye'`, then `<i class="fa fa-fw fa-eye"></i>` is rendered.<br><br>Leave blank to render no icon. | `''`     |
| **classes**              | string[]                       | An array of CSS classes to add onto the rendered item (either the button or the<br>dropdown option) | `[]`     |
| **contextMenuClasses**   | string[]                       | An array of CSS classes to add onto the rendered item (ONLY the<br>dropdown version) | `[]`     |
| **buttonClasses**        | string[]                       | An array of CSS classes to add onto the rendered item (ONLY the button version) | `[]`     |
| **id**                   | string                         | Optionally you may assign an id to the item's rendered element if you wish to target it with any custom code later on | `''`     |
| **confirmation**         | object<br>or<br>function(rows) | The confirmation configuration object.<br><br>Include a  `title` and a `message` that will appear in the default browser `confirm` dialogue<br><br>**OR** you may provide a confirmation object that matches that of [Bootbox.js](http://bootboxjs.com/), and then override the default confirmation behavior by passing `bootbox.confirm` to `options.showConfirmationMethod` <br> <br>Example (default behavior):<br><br>`{`<br>`title:'Foo'`,<br>`message:'Are you sure you want to Bar?'`<br>`}`<br><br/><br>Example (if using Bootbox):<br><br>`{`<br>`    title: 'Delete Item(s)',`<br>`    message: 'Do you want to delete the item(s)?',`<br>`    buttons: {`<br>`        cancel: {`<br>`            className: 'btn-link',`<br>`            label: 'Cancel'`<br>`        },`<br>`        confirm: {`<br>`            className: 'btn-danger',`<br>`            label: 'Delete'`<br>`   }`<br>`}` | `{}`     |
| **action**               | function(rows)                 | The action to execute against the 1 or more `rows` selected when the action was executed | required |
| **isDisabled**           | bool<br>or<br>function(row)    | Whether or not to totally disable the option.<br><br>If a function of `row` is provided, this becomes a test to run against every selected row.<br>If ANY of the rows pass this test, the option will be disabled<br><br>For example, to disable the button for "John" rows:<br>`(row) => row.FirstName === 'John'` | `{}`     |
| **isDisabledStrictMode** | bool                           | Modifies the behavior of `isDisabled` (see above). If specified and is `true`, then rather than allowing a `multi`-enabled button to be clicked when ANY selected row is enabled/applicable, ONLY enable the option if ALL selected rows are enabled/applicable. <br><br> `isDisabledStrictMode` ensures that ALL selected rows fail the `isDisabled` check (in other words, are ALL enabled) before allowing an action to be confirmed or executed | `false`  |
| **isHidden**             | bool<br>or<br>function(row)    | Similar to the above `isDisabled` but renders an option hidden/invisible instead of just being disabled (greyed out) | `{}`     |





Please see the example page referred to above for a demo of how to use all these options together.






# Initialization:
Initialize with the configuration object as described above.

For example:
```javascript
$(document).ready( function () {
    // Set up our table in standard DataTables fashion (with selection enabled)
    var myTable = $('#dt').DataTable({
        select: {
            style:    'os',
            selector: 'td:first-child'
        }
    });

    // And initialize our plugin.
    myTable.contextualActions({
        // Configuration options as described above
    });
});
```

# Refreshing:
If you change underlying data that some renderers rely on (`isDisabled` on a `static`-typed action, for example), and want to update the controls without having the user manually select/deselect rows, you can force-update contextualActions like so:

```javascript
$(document).ready( function () {
    var myTable = $('#dt').DataTable({
        // ...
    });

    // And initialize our plugin.
    var myContextActions = myTable.contextualActions({
        // ...
    });

    // Manually refresh the control and force all actions to be re-evaluated
    myContextActions.update();
});
```

[ContextMenu]: https://github.com/torrobinson/datatables-contextual-actions/blob/master/resources/context-menu.png "Context Menu"
[ButtonList]: https://github.com/torrobinson/datatables-contextual-actions/blob/master/resources/buttons.png "Button List"
[ButtonListIconOnly]: https://github.com/torrobinson/datatables-contextual-actions/blob/master/resources/buttonIconOnly.png "Button List Icon Only"
