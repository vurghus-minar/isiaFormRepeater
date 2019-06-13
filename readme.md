# isiaFormRepeater

Check out the [**demo**](https://codepen.io/vurghusm/pen/zVGjyr) on Codepen: [https://codepen.io/vurghusm/pen/zVGjyr](https://codepen.io/vurghusm/pen/zVGjyr)

### About

isiaFormRepeater is simple and lightweight jquery form repeater plugin.

### Wordpress Plugin Repeater Field

You can find a sample demo of how to use isiaFormRepeater in creating repeater fields in Wordpress plugins [here](https://github.com/vurghus-minar/Wordpress-Plugin-Repeater-Field-Example)

### Get started

- Clone the repository to your dev server.
- Run `npm install`
- Run `gulp` to compile scripts and start the dev server
- Browsesync should load the demo in your default browser automatically.
- If not copy the server address from the command shell and load in your browser to run the demo.
- Demo is served from `./demo/public` folder

### Example Use

Reference the following styles in your html header:

```html
<link rel="stylesheet" href="path_to_css_folder/isiaFormRepeater.css" />
```

Reference the following scripts in your html footer:

```html
<!-- Jquery is a required dependency -->
<script src="path_to_js_folder/jquery.js" type="text/javascript"></script>
<script
  src="path_to_js_folder/isiaFormRepeater.js"
  type="text/javascript"
></script>
```

Create the repeater element as follows:

```html
<div
  class="isiaFormRepeater repeat-section"
  id="repeaterElement"
  data-field-id="test_field_id"
  data-items-index-array="[1]"
>
  <div class="repeat-items">
    <div class="repeat-item" data-field-index="1">
      <input
        class="repeat-el"
        id="test_field_id[1][test_sub1]"
        name="test_field_id[1][test_sub1]"
      /><input
        class="repeat-el"
        id="test_field_id[1][test_sub2]"
        name="test_field_id[1][test_sub2]"
      />
    </div>
  </div>
</div>
```

##### !!!Required HTML parameters

- `data-field-id` is specified within the `repeater-section`. It is the base ID of all `repeat-item`.
- `data-items-index-array` specifies index of `repeater-item` in the array. E.g A value of [1] is the first item present in the initial form. This value should equivalent to `data-field-index` in the corresponding `repeater-item`
- The id and name of a `repeat-el` are broken down as follows:
  ```
  'test_field_id[1][test_sub1]'
  'test_field_id' is the base id and is equal to the value specified in 'data-field-id'.
  '[1]' the index following the base id is what will increase or decrease when new repeat items are added.
  '[test_sub1]' is the unique identifier for the input field.
  ```

Initialize the script as follows in the footer:

```html
<script type="text/javascript">
  $(document).ready(function() {
    $("#repeaterElement").isiaFormRepeater();
  });
</script>
```
