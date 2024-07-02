package com.example.pyquiz;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import android.graphics.Color;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Random;
import java.util.Set;
import java.util.HashSet;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;


public class MainActivity2 extends AppCompatActivity {
    int index = 0;
    int score = 0;
    String level ;

    private Button next;
    private Button prev;
    private Button submit;
    private TextView question;
    private TextView optiona;
    private TextView optionb;
    private TextView optionc;
    private TextView optiond;
    private ImageView logo;
    private ConstraintLayout main;

    String [] allquestions;
    String [][] alloptions;
    String [] allanswers;

    String []  test_questions;
    String [][]  test_options;
    String []  test_answers;

    String [] our_answers = new String[100];




    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main2);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        main = findViewById(R.id.main);
        logo = findViewById(R.id.logo);
        next = findViewById(R.id.next);
        prev = findViewById(R.id.prev);
        submit = findViewById(R.id.subm);
        question = findViewById(R.id.question);
        optiona = findViewById(R.id.optiona);
        optionb = findViewById(R.id.optionb);
        optionc = findViewById(R.id.optionc);
        optiond = findViewById(R.id.optiond);

        prev.setVisibility(View.GONE);
        submit.setVisibility(View.GONE);


        Intent intent = getIntent();
        level = intent.getStringExtra("quiz_level");

        if(level.equals("Level 1")) {
            main.setBackgroundColor(Color.parseColor("#786546"));
            logo.setImageResource(R.drawable.bronz);
            try {
                String filename = "python_basics.json";
                allquestions = getQuestions(filename);
                alloptions = getOptions(filename);
                allanswers = getCorrectAnswers(filename);

                int [] random_index = get_index(15 , 0 , allquestions.length);

                test_questions = gettest(random_index , allquestions);
                test_answers = gettest(random_index , allanswers);
                test_options = gettest(random_index , alloptions);

                question.setText(test_questions[0]);
                optiona.setText(test_options[0][0]);
                optionb.setText(test_options[0][1]);
                optionc.setText(test_options[0][2]);
                optiond.setText(test_options[0][3]);
            } catch (IOException | JSONException e) {
                e.printStackTrace();
            }
        }

        if(level.equals("Level 2")){
            main.setBackgroundColor(Color.parseColor("#5B6161"));
            logo.setImageResource(R.drawable.silver);
            try {
                String filename = "python_for_ds.json";
                allquestions = getQuestions(filename);
                alloptions = getOptions(filename);
                allanswers = getCorrectAnswers(filename);

                int [] random_index = get_index(15 , 0 , allquestions.length);

                test_questions = gettest(random_index , allquestions);
                test_answers = gettest(random_index , allanswers);
                test_options = gettest(random_index , alloptions);

                question.setText(test_questions[0]);
                optiona.setText(test_options[0][0]);
                optionb.setText(test_options[0][1]);
                optionc.setText(test_options[0][2]);
                optiond.setText(test_options[0][3]);
            } catch (IOException | JSONException e) {
                e.printStackTrace();
            }
        }

        if(level.equals("Level 3")){
            main.setBackgroundColor(Color.parseColor("#3B6272"));
            logo.setImageResource(R.drawable.crystal);
            try {
                String filename = "python_for_dv.json";
                allquestions = getQuestions(filename);
                alloptions = getOptions(filename);
                allanswers = getCorrectAnswers(filename);

                int [] random_index = get_index(4 , 0 , allquestions.length);

                test_questions = gettest(random_index , allquestions);
                test_answers = gettest(random_index , allanswers);
                test_options = gettest(random_index , alloptions);

                question.setText(test_questions[0]);
                optiona.setText(test_options[0][0]);
                optionb.setText(test_options[0][1]);
                optionc.setText(test_options[0][2]);
                optiond.setText(test_options[0][3]);
            } catch (IOException | JSONException e) {
                e.printStackTrace();
            }
        }

        if(level.equals("Level 4")){
            main.setBackgroundColor(Color.parseColor("#602E2C"));
            logo.setImageResource(R.drawable.elite);
            try {
                String filename = "python_for_ml.json";
                allquestions = getQuestions(filename);
                alloptions = getOptions(filename);
                allanswers = getCorrectAnswers(filename);

                int [] random_index = get_index(5 , 0 , allquestions.length);

                test_questions = gettest(random_index , allquestions);
                test_answers = gettest(random_index , allanswers);
                test_options = gettest(random_index , alloptions);

                question.setText(test_questions[0]);
                optiona.setText(test_options[0][0]);
                optionb.setText(test_options[0][1]);
                optionc.setText(test_options[0][2]);
                optiond.setText(test_options[0][3]);
            } catch (IOException | JSONException e) {
                e.printStackTrace();
            }
        }

        if(level.equals("Level 5")){
            main.setBackgroundColor(Color.parseColor("#7E6A31"));
            logo.setImageResource(R.drawable.champ);
            try {
                String filename = "python_for_webdev.json";
                allquestions = getQuestions(filename);
                alloptions = getOptions(filename);
                allanswers = getCorrectAnswers(filename);

                int [] random_index = get_index(5 , 0 , allquestions.length);

                test_questions = gettest(random_index , allquestions);
                test_answers = gettest(random_index , allanswers);
                test_options = gettest(random_index , alloptions);

                question.setText(test_questions[0]);
                optiona.setText(test_options[0][0]);
                optionb.setText(test_options[0][1]);
                optionc.setText(test_options[0][2]);
                optiond.setText(test_options[0][3]);
            } catch (IOException | JSONException e) {
                e.printStackTrace();
            }
        }

    }

    private String[] getQuestions(String file) throws IOException, JSONException {
        String json = loadJSONFromAssets(file);
        JSONObject jsonObject = new JSONObject(json);
        JSONArray questionsArray = jsonObject.getJSONArray("questions");

        String[] questions = new String[questionsArray.length()];
        for (int i = 0; i < questionsArray.length(); i++) {
            JSONObject questionObject = questionsArray.getJSONObject(i);
            questions[i] = questionObject.getString("question");
        }
        return questions;
    }

    private String[][] getOptions(String file) throws IOException, JSONException {
        String json = loadJSONFromAssets(file);
        JSONObject jsonObject = new JSONObject(json);
        JSONArray questionsArray = jsonObject.getJSONArray("questions");

        String[][] optionsArray = new String[questionsArray.length()][];
        for (int i = 0; i < questionsArray.length(); i++) {
            JSONObject questionObject = questionsArray.getJSONObject(i);
            JSONArray options = questionObject.getJSONArray("options");

            String[] optionsForQuestion = new String[options.length()];
            for (int j = 0; j < options.length(); j++) {
                optionsForQuestion[j] = options.getString(j);
            }
            optionsArray[i] = optionsForQuestion;
        }
        return optionsArray;
    }

    private String[] getCorrectAnswers(String file) throws IOException, JSONException {
        String json = loadJSONFromAssets(file);
        JSONObject jsonObject = new JSONObject(json);
        JSONArray questionsArray = jsonObject.getJSONArray("questions");

        String[] correctAnswers = new String[questionsArray.length()];
        for (int i = 0; i < questionsArray.length(); i++) {
            JSONObject questionObject = questionsArray.getJSONObject(i);
            correctAnswers[i] = questionObject.getString("correct_answer");
        }
        return correctAnswers;
    }

    private String loadJSONFromAssets(String fileName) throws IOException {
        InputStream is = getAssets().open(fileName);
        int size = is.available();
        byte[] buffer = new byte[size];
        is.read(buffer);
        is.close();
        return new String(buffer, StandardCharsets.UTF_8);
    }

    public int[] get_index(int length, int min, int max) {
        Random random = new Random();
        Set<Integer> uniqueNumbers = new HashSet<>();

        while (uniqueNumbers.size() < length) {
            int number = random.nextInt((max - min) ) + min;
            uniqueNumbers.add(number);
        }

        int[] result = new int[length];
        int index = 0;
        for (int number : uniqueNumbers) {
            result[index++] = number;
        }

        return result;
    }

    public String [] gettest(int [] index , String [] questions){
        String [] result = new String[index.length];
        for (int i = 0; i < index.length ; i++) {
            result[i]= questions[index[i]];
        }
        return result;
    }

    public static String[][] gettest(int[] index, String[][] questions) {
        String[][] result = new String[index.length][];
        for (int i = 0; i < index.length; i++) {
            result[i] = questions[index[i]];
        }
        return result;
    }

    public void selecta(View v){
        optiona.setBackgroundColor(Color.parseColor("#4CAF50"));
        optionb.setBackgroundColor(Color.parseColor("#FFFFFF"));
        optionc.setBackgroundColor(Color.parseColor("#FFFFFF"));
        optiond.setBackgroundColor(Color.parseColor("#FFFFFF"));
        our_answers[index] = test_options[index][0];
    }

    public void selectb(View v){
        optiona.setBackgroundColor(Color.parseColor("#FFFFFF"));
        optionb.setBackgroundColor(Color.parseColor("#4CAF50"));
        optionc.setBackgroundColor(Color.parseColor("#FFFFFF"));
        optiond.setBackgroundColor(Color.parseColor("#FFFFFF"));
        our_answers[index] = test_options[index][1];
    }

    public void selectc(View v){
        optiona.setBackgroundColor(Color.parseColor("#FFFFFF"));
        optionb.setBackgroundColor(Color.parseColor("#FFFFFF"));
        optionc.setBackgroundColor(Color.parseColor("#4CAF50"));
        optiond.setBackgroundColor(Color.parseColor("#FFFFFF"));

        our_answers[index] = test_options[index][2];
    }

    public void selectd(View v){
        optiona.setBackgroundColor(Color.parseColor("#FFFFFF"));
        optionb.setBackgroundColor(Color.parseColor("#FFFFFF"));
        optionc.setBackgroundColor(Color.parseColor("#FFFFFF"));
        optiond.setBackgroundColor(Color.parseColor("#4CAF50"));
        our_answers[index] = test_options[index][3];
    }

    public void nextbtn(View v){
        index  = index + 1;
        prev.setVisibility(View.VISIBLE);

        if(index == test_questions.length-1){
            next.setVisibility(View.GONE);
            submit.setVisibility(View.VISIBLE);
        }

        optiona.setBackgroundColor(Color.parseColor("#FFFFFF"));
        optionb.setBackgroundColor(Color.parseColor("#FFFFFF"));
        optionc.setBackgroundColor(Color.parseColor("#FFFFFF"));
        optiond.setBackgroundColor(Color.parseColor("#FFFFFF"));


        if(index < test_questions.length){
            question.setText(test_questions[index]);
            optiona.setText(test_options[index][0]);
            optionb.setText(test_options[index][1]);
            optionc.setText(test_options[index][2]);
            optiond.setText(test_options[index][3]);
        }

        else{
            next.setVisibility(View.GONE);
            submit.setVisibility(View.VISIBLE);
        }

    }

    public void prevbtn(View v){
        index  = index - 1;
        next.setVisibility(View.VISIBLE);
        submit.setVisibility(View.GONE);

        if(index ==0){
            prev.setVisibility(View.GONE);
        }

        optiona.setBackgroundColor(Color.parseColor("#FFFFFF"));
        optionb.setBackgroundColor(Color.parseColor("#FFFFFF"));
        optionc.setBackgroundColor(Color.parseColor("#FFFFFF"));
        optiond.setBackgroundColor(Color.parseColor("#FFFFFF"));

        if(index < test_questions.length && index >= 0){
            question.setText(test_questions[index]);
            optiona.setText(test_options[index][0]);
            optionb.setText(test_options[index][1]);
            optionc.setText(test_options[index][2]);
            optiond.setText(test_options[index][3]);
        }
        else {
            prev.setVisibility(View.GONE);
        }

    }

    public void submitbtn(View v){

        for(int i = 0;i<test_questions.length;i++){
            if(our_answers[i].equals(test_answers[i])){
                score = score +1;
            }
        }
        Intent intent = new Intent(this, MainActivity3.class);
        intent.putExtra("score", score);
        intent.putExtra("quiz_level", level);
        intent.putExtra("outoff", test_questions.length);

        startActivity(intent);



    }









}
