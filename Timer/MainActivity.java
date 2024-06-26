package com.example.myapplication;

import android.os.Bundle;
import android.os.CountDownTimer;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;




public class MainActivity extends AppCompatActivity {
    TextView timer;


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

        timer=findViewById(R.id.time);

    }

    public  String settime(int hour , int min , int sec){
        String hourst , minst , secst;

        hourst = String.valueOf(hour);
        minst = String.valueOf(min);
        secst = String.valueOf(sec);

        if(hour < 10){
            hourst = "0"+hourst;
        }
        if(min < 10){
            minst = "0"+minst;
        }
        if(sec < 10){
            secst = "0"+secst;
        }

        String result = hourst+":"+minst+":"+secst;
        return  result;
    }

    public int[] gettime(String currenttime) {
        String[] parts = currenttime.split(":");
        int[] timeParts = new int[3];
        timeParts[0] = Integer.parseInt(parts[0]);
        timeParts[1] = Integer.parseInt(parts[1]);
        timeParts[2] = Integer.parseInt(parts[2]);

        return timeParts;
    }

    public void addsec(View view){
        String currenttime = timer.getText().toString();

        int [] time = gettime(currenttime);
        int hours = time[0];
        int minutes = time[1];
        int seconds = time[2];

        seconds = seconds + 1;
        if(seconds >= 60){
            seconds = 0;
            minutes = minutes + 1;
        }
        if(minutes >= 60){
            minutes = 0;
            hours = hours +1;
        }
        String newtime = settime(hours , minutes , seconds);
        timer.setText(newtime);

    }

    public void addmin(View view){
        String currenttime = timer.getText().toString();

        int [] time = gettime(currenttime);
        int hours = time[0];
        int minutes = time[1];
        int seconds = time[2];

        minutes = minutes + 1;

        if(minutes >= 60){
            minutes = 0;
            hours = hours +1;
        }
        String newtime = settime(hours , minutes , seconds);
        timer.setText(newtime);

    }

    public void addhour(View view){
        String currenttime = timer.getText().toString();

        int [] time = gettime(currenttime);
        int hours = time[0];
        int minutes = time[1];
        int seconds = time[2];

        hours= hours + 1;

        String newtime = settime(hours , minutes , seconds);
        timer.setText(newtime);

    }

    public void play(View view) {
        String timest = timer.getText().toString();

        int[] time = gettime(timest);
        int hours = time[0];
        int min = time[1];
        int sec = time[2];

        int total_sec = 3600 * hours + 60 *min + sec;

        CountDownTimer countDownTimer = new CountDownTimer(total_sec * 1000, 1000) {
            @Override
            public void onTick(long millisUntilFinished) {
                int remainingSec = (int) (millisUntilFinished / 1000);
                int hours = remainingSec / 3600;
                remainingSec %= 3600;
                int min = remainingSec / 60;
                int sec = remainingSec % 60;

                String newtime = settime(hours, min, sec);
                timer.setText(newtime);
            }

            @Override
            public void onFinish() {
                timer.setText(settime(0, 0, 0));
                Toast.makeText(view.getContext(), "Timer Ended", Toast.LENGTH_SHORT).show();
            }
        };

        countDownTimer.start();
    }

}

