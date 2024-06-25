package com.example.myapplication;

import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {

    private TextView count;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        count = findViewById(R.id.count);


    }

    public void increment(View view) {
        String s = count.getText().toString();
        int num = Integer.parseInt(s);
        num = num + 1;
        count.setText(String.valueOf(num));
    }

    public void decrement(View view){
        String s = count.getText().toString();
        int num = Integer.parseInt(s);
        num = num - 1;
        count.setText(String.valueOf(num));
    }

    public void reset(View view){
        String s = count.getText().toString();
        int num = Integer.parseInt(s);
        count.setText(String.valueOf(0));
    }

}