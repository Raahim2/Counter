package com.example.expensemanager;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = "MainActivity";
    private static final String FILE_NAME = "expenses.json";
    private RecyclerView recyclerView;
    private CustomAdapter adapter;
    private Expense[] expenses;
    private TextView navdate;
    int currentmonth;
    private TextView income;
    private TextView expenseSt;
    private TextView savings;



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
        income = findViewById(R.id.income);
        expenseSt = findViewById(R.id.Expense);
        savings = findViewById(R.id.Savings);


        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            LocalDate today = LocalDate.now();
            currentmonth = today.getMonthValue();
            String monthName = today.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
            String year = String.valueOf(today.getYear());
            navdate = findViewById(R.id.navdate);
            navdate.setText(monthName +" "+year);
        }

        if (!isFileExists(FILE_NAME)) {
            copyAssetsToInternalStorage();
        }

        try {
            expenses = filterexpense(currentmonth , FILE_NAME);
            income.setText(getIncome() + "₹");
            expenseSt.setText(getExpense() + "₹");
            int saveincome = getIncome() - getExpense();
            savings.setText(saveincome + "₹");

            if(saveincome > 0){
                savings.setTextColor(Color.parseColor("#4CAF50"));
            }
            else {
                savings.setTextColor(Color.parseColor("#F44336"));
            }
            setupRecyclerView();
        } catch (IOException | JSONException e) {
            Log.e(TAG, "Error loading expenses", e);
        }
    }

    private boolean isFileExists(String fileName) {
        try {
            FileInputStream fis = openFileInput(fileName);
            fis.close();
            return true;
        } catch (IOException e) {
            return false;
        }
    }

    private void copyAssetsToInternalStorage() {
        try {
            InputStream is = getAssets().open(FILE_NAME);
            FileOutputStream fos = openFileOutput(FILE_NAME, Context.MODE_PRIVATE);
            byte[] buffer = new byte[1024];
            int length;
            while ((length = is.read(buffer)) > 0) {
                fos.write(buffer, 0, length);
            }
            fos.close();
            is.close();
        } catch (IOException e) {
            Log.e(TAG, "Error copying file", e);
        }
    }

    public String loadJSONFromInternalStorage(String FILENAME) throws IOException {
        FileInputStream fis = openFileInput(FILENAME);
        int size = fis.available();
        byte[] buffer = new byte[size];
        fis.read(buffer);
        fis.close();
        return new String(buffer, StandardCharsets.UTF_8);
    }

    private int getIncome() {
        int income = 0;
        if(expenses == null){
            return income;
        }
        for (int i = 0; i < expenses.length; i++) {
            String currenttype = expenses[i].getType();
            if(currenttype.equals("SALARY") || currenttype.equals("RENT") || currenttype.equals("BUSINESS") ){
                income = income + expenses[i].getAmount();
            }
        }
        return income;
    }

    private int getExpense() {
        int expense = 0;

        Set<String> validTypes = new HashSet<>();
        validTypes.add("GROCERIES");
        validTypes.add("EDUCATION");
        validTypes.add("TRANSPORT");
        validTypes.add("MEDICAL");
        validTypes.add("OTHERS");


        if (expenses == null) {
            return expense;
        }

        for (Expense expenseObj : expenses) {
            String currentType = expenseObj.getType();
            if (validTypes.contains(currentType)) {
                expense += expenseObj.getAmount();
            }
        }

        return expense;
    }

    public Expense[] filterexpense(int month , String FILENAME) throws IOException, JSONException {
        String json = loadJSONFromInternalStorage(FILENAME);

        JSONArray arr = new JSONArray(json);
        List<Expense> filteredExpenses = new ArrayList<>();

        for (int i = 0; i < arr.length(); i++) {
            JSONObject obj = arr.getJSONObject(i);

            String date = obj.getString("date");
            String[] parts = date.split("/");

            int monthfromjson = Integer.parseInt(parts[1]);

            if (monthfromjson == month) {
                String task = obj.getString("task");
                String type = obj.getString("type");
                int amount = obj.getInt("amount");
                filteredExpenses.add(new Expense(task, date, amount, type));
            }
        }

        return filteredExpenses.toArray(new Expense[0]);
    }

    private void setupRecyclerView() {
        recyclerView = findViewById(R.id.recycle);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        adapter = new CustomAdapter(expenses);
        recyclerView.setAdapter(adapter);
        recyclerView.addItemDecoration(new DividerItemDecoration(this, DividerItemDecoration.VERTICAL));
    }

    @Override
    protected void onResume() {
        super.onResume();
        //when user will come from some other page to home page
        try {
            expenses = filterexpense(currentmonth , FILE_NAME);
            adapter.updateExpenses(expenses);

            income.setText(getIncome() + "₹");
            expenseSt.setText(getExpense() + "₹");
            int saveincome = getIncome() - getExpense();
            savings.setText(saveincome + "₹");

            if(saveincome > 0){
                savings.setTextColor(Color.parseColor("#4CAF50"));
            }
            else {
                savings.setTextColor(Color.parseColor("#F44336"));
            }
            setupRecyclerView();
        } catch (IOException | JSONException e) {
            Log.e(TAG, "Error reloading expenses", e);
        }
    }

    public void setmonth(String type){
        Month monthEnum = null;
        if(type.equals("NEXT")){
            currentmonth = currentmonth + 1;
            if(currentmonth > 12){
                currentmonth =1;
            }
        }
        else if(type.equals("PREV")){
            currentmonth = currentmonth - 1;
            if(currentmonth < 1){
                currentmonth =12;
            }
        }

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            monthEnum = Month.of(currentmonth);
            LocalDate today = LocalDate.now();
            String year = String.valueOf(today.getYear());
            String monthstr = monthEnum.getDisplayName(TextStyle.FULL, Locale.ENGLISH);

            navdate.setText(monthstr + " "+year);
        }
        onResume();
    }

    public void nextmounth(View v){
        setmonth("NEXT");
    }

    public void prevmounth(View v){
        setmonth("PREV");
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
