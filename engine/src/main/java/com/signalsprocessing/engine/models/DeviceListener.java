package com.signalsprocessing.engine.models;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;

import com.signalsprocessing.engine.shared.BeanUtils;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PreUpdate;

@Component
@ComponentScan
public class DeviceListener {
    @PreUpdate
    public void beforeUpdate(Device device) {
        EntityManager entityManager = BeanUtils.getBean(EntityManager.class);
        DeviceStatusRecord record = new DeviceStatusRecord();
        record.setDevice(device);
        record.setStatus(device.status);

        entityManager.persist(record);
    }
}
