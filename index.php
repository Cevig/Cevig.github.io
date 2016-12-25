<!DOCTYPE html>
<html lang="en" >
<head>
    <meta charset="UTF-8">
    <link href="css/bootstrap.css" rel="stylesheet">
    <link rel="stylesheet/less" type="text/css" href="css/style.less"/>
    <script src="js/lib/jquery.js"></script>
    <script src="js/lib/bootstrap.js"></script>
    <script src="js/lib/less.min.js"></script>
    <script defer src="js/main.js"></script>
    <title>Users</title>
</head>
<body>
<header><h1>Users list</h1></header>
<div class="container">
    <div class="row">
        <table class="table table-hover table-bordered col-sm-6 col-sm-offset-3">
            <thead>
            <tr>
                <th>First name</th><th>Second name</th><th>E-mail</th>
            </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
        <a href="#" class="col-sm-12 col-sm-offset-3 glyphicon glyphicon-plus-sign"></a>
        <form name="person" class="form-horizontal col-sm-10 col-sm-offset-1 hidden">
            <div class="form-group">
                <label class="control-label col-sm-4" for="name">First name:</label>
                <div class="col-sm-6">
                    <input type="text" class="form-control" name="name" id="name" placeholder="Enter name">
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-4" for="lname">Second name:</label>
                <div class="col-sm-6">
                    <input type="text" class="form-control" id="lname" name="lname" placeholder="Enter second name">
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-4" for="email">E-mail:</label>
                <div class="col-sm-6">
                    <input type="email" class="form-control" id="email" name="email" placeholder="Enter email">
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-offset-4 col-sm-6">
                    <button id="submit" type="button" class="btn btn-default" onclick="checkForm(this.form)">Submit</button>
                </div>
            </div>
        </form>
    </div>
</div>
</body>
</html>