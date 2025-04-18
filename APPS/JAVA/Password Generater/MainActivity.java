package com.example.myapplication;

import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import java.util.Random;

import android.view.View;
import android.widget.CheckBox;
import android.widget.SeekBar;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {
    CheckBox c1;
    CheckBox c2;
    CheckBox c3;
    SeekBar s;
    TextView pass;
    Random random = new Random();

    char[] uppercaseLetters = {
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
            'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    };

    char[] lowercaseLetters = {
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
            'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
    };

    char[] numbers = {
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
    };

    char[] specialCharacters = {
            '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '-',
            '=', '[', ']', '{', '}', '|', ':', ';', '"', ',', '<',
            '.', '>', '/', '?'
    };
    char[] finalarray = lowercaseLetters;



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
        c1 = findViewById(R.id.checkBox);
        c2 = findViewById(R.id.checkBox2);
        c3 = findViewById(R.id.checkBox3);
        s = findViewById(R.id.seekBar);
        pass = findViewById(R.id.password);

    }

    public char[] concatenateArrays(char[] array1, char[] array2) {
        char[] result = new char[array1.length + array2.length];
        System.arraycopy(array1, 0, result, 0, array1.length);
        System.arraycopy(array2, 0, result, array1.length, array2.length);
        return result;
    }

    public void generate_password(View view){
        StringBuilder generated = new StringBuilder();
        int len = s.getProgress();

        if(c1.isChecked()){
            //concatenate uppercase array in final array
            finalarray =  concatenateArrays(finalarray , uppercaseLetters);
        }
        if(c2.isChecked()){
            //concatenate number array in final array
            finalarray =  concatenateArrays(finalarray , numbers);
        }
        if(c3.isChecked()){
            //concatenate special char array in final array
            finalarray =  concatenateArrays(finalarray , specialCharacters);
        }
        for(int i=0 ; i<len ; i++){
            int index = random.nextInt(finalarray.length);
            generated.append(finalarray[index]);
        }
        pass.setText(generated);
        
    }

}