package com.example.expensemanager;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class CalenderPage extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_calender_page);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
    }

    public void movetoHomePage(View v) {
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
    }
    public void movetoAddExpensePage(View v) {
        Intent intent = new Intent(this, AddExpense.class);
        startActivity(intent);
    }
    public void movetoCalenderPage(View v) {
        Intent intent = new Intent(this, CalenderPage.class);
        startActivity(intent);
    }
    public void movetoStatsPage(View v) {
        Intent intent = new Intent(this, StatsPage.class);
        startActivity(intent);
    }
    public void movetoSettingsPage(View v) {
        Intent intent = new Intent(this, SettingsPage.class);
        startActivity(intent);
    }
}