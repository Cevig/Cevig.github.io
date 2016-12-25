<?php

class PDOconnect {
    private static $instance;
    private $pdo;
    private function __construct(){}

    public static function getInstance(){
        if( empty( self::$instance)){
            self::$instance = new PDOconnect();
        }
        return self::$instance;
    }
    public function setParams($host, $db, $user, $pass){
        if( !empty($this->pdo)) return;
        $opt = array(
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        );
        $this->pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass,$opt);
    }
    public function getAllNotes(){
        $res = $this->pdo->query('SELECT id, name, last_name, email FROM users WHERE deleted = 0')->fetchAll(PDO::FETCH_UNIQUE);
        return $res;
    }
    public function removeNote($id){
        $stm = $this->pdo->prepare("UPDATE users SET deleted = 1 WHERE id = ?");
        $res = $stm->execute(array($id));
        return $res;
    }
    public function updateNote(array $data){
        $stm = $this->pdo->prepare("UPDATE users SET name = :name, last_name = :lname, email = :email WHERE id = :id");
        $res = $stm->execute($data);
        return $res;
    }
    public function addNote(array $data){
        $stm = $this->pdo->prepare("INSERT INTO users (id, name, last_name, email) VALUES (null, :name, :lname, :email)");
        $stm->execute($data);
        $res = $this->pdo->query('SELECT MAX(id) FROM users')->fetchColumn();

        return $res;
    }
    public function executeRequest($action){
        if($action == 'getAll')
            return  $this->getAllNotes();
        else if($action == 'remove')
            return  $this->removeNote($_POST['id']);
        else if($action == 'update') {
            $arr = array(
                'id' => $_POST['id'],
                'name' => $_POST['name'],
                'lname' => $_POST['lname'],
                'email' => $_POST['email']
            );
            return $this->updateNote($arr);
        }
        else if($action == 'create'){
            $arr = array(
                'name' => $_POST['name'],
                'lname' => $_POST['lname'],
                'email' => $_POST['email']
            );
            return  $this->addNote($arr);
        }
        else
            return  null;
    }
}