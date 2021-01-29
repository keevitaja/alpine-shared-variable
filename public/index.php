<html>
    <body>
        <h1>hello</h1>

        <div x-data="parent()" x-init="init()">
            <input type="text" x-model="data.form.name">

            <p x-data="child()" x-init="init()">child: <span x-text="data.form.name"></span></p>
        </div>

        <hr>

        <p x-data="sibling()" x-init="init()">sibling: <span x-text="data.form.name"></span></p>

        <script src="/app.js"></script>
    </body>
</html>
