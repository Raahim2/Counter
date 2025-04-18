package com.example.expensemanager;


import android.content.Context;

import android.content.Intent;
import android.os.Bundle;


import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Spinner;
import android.widget.Toast;

import com.google.android.material.textfield.TextInputEditText;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;


public class AddExpense extends AppCompatActivity {
    private Spinner spinner;
    private TextInputEditText note;
    private TextInputEditText amount;
    private TextInputEditText dd;
    private TextInputEditText mm;
    private TextInputEditText yy;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_add_expense);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        spinner = findViewById(R.id.spinner);
        note = findViewById(R.id.note);
        amount = findViewById(R.id.amount);
        dd = findViewById(R.id.dd);
        mm = findViewById(R.id.mm);
        yy = findViewById(R.id.yy);


        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            LocalDate today = LocalDate.now();
            dd.setText(String.valueOf(today.getDayOfMonth()));
            mm.setText(String.valueOf(today.getMonthValue()));
            yy.setText(String.valueOf(today.getYear()));
        }

         String[] dropdownItems = new String[]{"GROCERIES", "EDUCATION", "TRANSPORT", "MEDICAL" , "SALARY" , "RENT" , "BUSINESS" ,"OTHERS" };
         ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item, dropdownItems);

        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner.setAdapter(adapter);

    }

    private JSONArray readJsonFromFile(Context context, String fileName) {
        try {
            FileInputStream fis = context.openFileInput(fileName);
            byte[] buffer = new byte[fis.available()];
            fis.read(buffer);
            fis.close();
            return new JSONArray(new String(buffer, StandardCharsets.UTF_8));
        } catch (IOException | JSONException e) {
            e.printStackTrace();
            return new JSONArray();
        }
    }

    private void writeJsonToFile(Context context, String fileName, JSONArray jsonArray) {
        try {
            FileOutputStream fos = context.openFileOutput(fileName, Context.MODE_PRIVATE);
            fos.write(jsonArray.toString().getBytes(StandardCharsets.UTF_8));
            fos.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    public void addExpenseItem(View v) {
        String task = note.getText().toString();
        String moneystr = amount.getText().toString();
        int money = Integer.parseInt(moneystr);
        String type = spinner.getSelectedItem().toString();
        String txtdd = dd.getText().toString();
        String txtmm = mm.getText().toString();
        String txtyy = yy.getText().toString();
        String txtdate = txtdd + "/" + txtmm + "/" + txtyy;

        if(task.isEmpty()){
            task = "Untitled";
        }
        if(moneystr.isEmpty()){
            money = 0;
        }

        Expense newExpense = new Expense(task, txtdate, money, type);
        JSONObject newExpenseJson = newExpense.toJson();

        JSONArray jsonArray = readJsonFromFile(this, "expenses.json");

        jsonArray.put(newExpenseJson);

        writeJsonToFile(this, "expenses.json", jsonArray);
        note.setHint(task);

        Toast.makeText(this, "Expense added", Toast.LENGTH_SHORT).show();
        finish();
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


