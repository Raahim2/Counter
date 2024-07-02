package com.example.pyquiz;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import org.json.JSONException;

import java.io.IOException;

public class MainActivity3 extends AppCompatActivity {
    private TextView scoretext;
    private ImageView image;
    private ConstraintLayout main;
    int score;
    int outoff;
    String level;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main3);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        Intent intent = getIntent();
        image = findViewById(R.id.imageView);
        main = findViewById(R.id.main);
        score = intent.getIntExtra("score" , 0);
        outoff = intent.getIntExtra("outoff" , 0);
        level = intent.getStringExtra("quiz_level");

        if(level.equals("Level 1")) {
            main.setBackgroundColor(Color.parseColor("#786546"));
            image.setImageResource(R.drawable.bronz);
        }

        if(level.equals("Level 2")){
            main.setBackgroundColor(Color.parseColor("#5B6161"));
            image.setImageResource(R.drawable.silver);
        }

        if(level.equals("Level 3")){
            main.setBackgroundColor(Color.parseColor("#3B6272"));
            image.setImageResource(R.drawable.crystal);
        }

        if(level.equals("Level 4")){
            main.setBackgroundColor(Color.parseColor("#602E2C"));
            image.setImageResource(R.drawable.elite);
        }

        if(level.equals("Level 5")){
            main.setBackgroundColor(Color.parseColor("#7E6A31"));
            image.setImageResource(R.drawable.champ);
        }



        scoretext = findViewById(R.id.score);
        scoretext.setText(score +"/"+outoff);

    }
}