import { describe, it, expect, beforeEach } from 'vitest';
import * as cacheService from '../services/cacheService.js';

describe('cacheService', () => {
  beforeEach(() => {
    cacheService.clear();
    cacheService.resetStats();
  });

  describe('set and get', () => {
    it('should store and retrieve a value', () => {
      cacheService.set('key1', 'value1');
      const result = cacheService.get('key1');
      expect(result).toBe('value1');
    });

    it('should return null for non-existent key', () => {
      const result = cacheService.get('nonexistent');
      expect(result).toBeNull();
    });

    it('should track cache hits', () => {
      cacheService.set('key1', 'value1');
      cacheService.get('key1');
      const stats = cacheService.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(0);
    });

    it('should track cache misses', () => {
      cacheService.get('nonexistent');
      const stats = cacheService.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(1);
    });
  });

  describe('del', () => {
    it('should delete a value', () => {
      cacheService.set('key1', 'value1');
      cacheService.del('key1');
      const result = cacheService.get('key1');
      expect(result).toBeNull();
    });
  });

  describe('clear', () => {
    it('should clear all cache entries', () => {
      cacheService.set('key1', 'value1');
      cacheService.set('key2', 'value2');
      cacheService.clear();
      const stats = cacheService.getStats();
      expect(stats.size).toBe(0);
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', () => {
      cacheService.set('key1', 'value1');
      cacheService.get('key1');
      cacheService.get('key2');

      const stats = cacheService.getStats();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
      expect(stats.sets).toBe(1);
      expect(stats.hitRate).toBe('50.00%');
    });

    it('should calculate 0% hit rate when no operations', () => {
      const stats = cacheService.getStats();
      expect(stats.hitRate).toBe('0%');
    });
  });

  describe('resetStats', () => {
    it('should reset all statistics', () => {
      cacheService.set('key1', 'value1');
      cacheService.get('key1');
      cacheService.resetStats();

      const stats = cacheService.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.sets).toBe(0);
    });
  });
});
