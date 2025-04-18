package com.example.expensemanager;

import org.json.JSONObject;

public class Expense {
    private String task;
    private String date;
    private int amount;
    private String type;

    public Expense(String task, String date, int amount, String type) {
        this.task = task;
        this.date = date;
        this.amount = amount;
        this.type = type;
    }

    public String getTask() {
        return task;
    }

    public String getDate() {
        return date;
    }

    public int getAmount() {
        return amount;
    }

    public String getType() {
        return type;
    }

    public void setTask(String task){
        this.task = task;
    }

    public void setDate(String date){
        this.date = date;
    }

    public void setAmount(int amount){
        this.amount = amount;
    }

    public void setType(String type){
        this.type = type;
    }

    @Override
    public String toString() {
        return "Expense{" +
                "task='" + task + '\'' +
                ", date='" + date + '\'' +
                ", amount=" + amount +
                ", type='" + type + '\'' +
                '}';
    }

    public JSONObject toJson() {
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("task", task);
            jsonObject.put("date", date);
            jsonObject.put("amount", amount);
            jsonObject.put("type", type);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return jsonObject;
    }

}
